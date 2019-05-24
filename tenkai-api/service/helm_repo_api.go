package helmapi

import (
	"fmt"
	"strings"

	"github.com/Masterminds/semver"
	"github.com/gosuri/uitable"
	"github.com/helm/helm/cmd/helm/search"
	"github.com/softplan/tenkai-api/dbms/model"
	"k8s.io/helm/pkg/helm/helmpath"
	"k8s.io/helm/pkg/repo"
)

// searchMaxScore suggests that any score higher than this is not considered a match.
const searchMaxScore = 25

type searchCmd struct {
	out      []*search.Result
	helmhome helmpath.Home

	versions bool
	regexp   bool
	version  string
	colWidth uint
}

//SearchCharts Methotd
func SearchCharts(searchTerms []string) *[]model.SearchResult {

	sc := &searchCmd{}
	//var defaultHelmHome = filepath.Join(homedir.HomeDir(), ".helm")

	var z helmpath.Home = "/home/denny/.helm"
	sc.helmhome = z

	sc.run(searchTerms)

	var res []*search.Result = sc.out

	var sr []model.SearchResult

	for _, r := range res {
		item := &model.SearchResult{Name: r.Name, ChartVersion: r.Chart.Version, AppVersion: r.Chart.AppVersion, Description: r.Chart.Description}
		sr = append(sr, *item)
	}

	return &sr

}

func (s *searchCmd) run(args []string) error {
	index, err := s.buildIndex()
	if err != nil {
		return err
	}

	var res []*search.Result
	if len(args) == 0 {
		res = index.All()
	} else {
		q := strings.Join(args, " ")
		res, err = index.Search(q, searchMaxScore, s.regexp)
		if err != nil {
			return err
		}
	}

	search.SortScore(res)
	data, err := s.applyConstraint(res)
	if err != nil {
		return err
	}
	s.out = data
	return nil
}

func (s *searchCmd) applyConstraint(res []*search.Result) ([]*search.Result, error) {
	if len(s.version) == 0 {
		return res, nil
	}

	constraint, err := semver.NewConstraint(s.version)
	if err != nil {
		return res, fmt.Errorf("an invalid version/constraint format: %s", err)
	}

	data := res[:0]
	foundNames := map[string]bool{}
	for _, r := range res {
		if _, found := foundNames[r.Name]; found {
			continue
		}
		v, err := semver.NewVersion(r.Chart.Version)
		if err != nil || constraint.Check(v) {
			data = append(data, r)
			if !s.versions {
				foundNames[r.Name] = true // If user hasn't requested all versions, only show the latest that matches
			}
		}
	}

	return data, nil
}

func (s *searchCmd) formatSearchResults(res []*search.Result, colWidth uint) string {
	if len(res) == 0 {
		return "No results found"
	}
	table := uitable.New()
	table.MaxColWidth = colWidth
	table.AddRow("NAME", "CHART VERSION", "APP VERSION", "DESCRIPTION")
	for _, r := range res {
		table.AddRow(r.Name, r.Chart.Version, r.Chart.AppVersion, r.Chart.Description)
	}
	return table.String()
}

func (s *searchCmd) buildIndex() (*search.Index, error) {
	// Load the repositories.yaml
	rf, err := repo.LoadRepositoriesFile(s.helmhome.RepositoryFile())
	if err != nil {
		return nil, err
	}

	i := search.NewIndex()
	for _, re := range rf.Repositories {
		n := re.Name
		f := s.helmhome.CacheIndex(n)
		ind, err := repo.LoadIndexFile(f)
		if err != nil {
			//fmt.Fprintf(s.out, "WARNING: Repo %q is corrupt or missing. Try 'helm repo update'.\n", n)
			continue
		}

		i.AddRepo(n, ind, s.versions || len(s.version) > 0)
	}
	return i, nil
}
