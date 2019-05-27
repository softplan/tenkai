package helmapi

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/ghodss/yaml"
	"github.com/gosuri/uitable"

	"k8s.io/helm/pkg/helm"
	"k8s.io/helm/pkg/proto/hapi/release"
	"k8s.io/helm/pkg/proto/hapi/services"
	"k8s.io/helm/pkg/timeconv"
)

type listCmd struct {
	filter      string
	short       bool
	limit       int
	offset      string
	byDate      bool
	sortDesc    bool
	out         io.Writer
	all         bool
	deleted     bool
	deleting    bool
	deployed    bool
	failed      bool
	namespace   string
	superseded  bool
	pending     bool
	client      helm.Interface
	colWidth    uint
	output      string
	byChartName bool
}

//HelmListResult Structure
type HelmListResult struct {
	Next     string
	Releases []listRelease
}

type listRelease struct {
	Name       string
	Revision   int32
	Updated    string
	Status     string
	Chart      string
	AppVersion string
	Namespace  string
}

//ListHelmDeployments method
func ListHelmDeployments() *HelmListResult {

	settings.TillerNamespace = "kube-system"
	settings.TLSEnable = false
	settings.TLSVerify = false
	settings.TillerConnectionTimeout = 1200

	list := &listCmd{out: os.Stdout}
	setupConnection()
	list.client = newClient()
	resultListResult, _ := list.run()
	teardown()
	settings.TillerHost = ""

	return resultListResult
}

func (l *listCmd) run() (*HelmListResult, error) {

	sortBy := services.ListSort_NAME
	if l.byDate {
		sortBy = services.ListSort_LAST_RELEASED
	}
	if l.byChartName {
		sortBy = services.ListSort_CHART_NAME
	}

	sortOrder := services.ListSort_ASC
	if l.sortDesc {
		sortOrder = services.ListSort_DESC
	}

	stats := l.statusCodes()

	res, err := l.client.ListReleases(
		helm.ReleaseListLimit(l.limit),
		helm.ReleaseListOffset(l.offset),
		helm.ReleaseListFilter(l.filter),
		helm.ReleaseListSort(int32(sortBy)),
		helm.ReleaseListOrder(int32(sortOrder)),
		helm.ReleaseListStatuses(stats),
		helm.ReleaseListNamespace(l.namespace),
	)

	if err != nil {
		return nil, prettyError(err)
	}
	if res == nil {
		return nil, nil
	}

	rels := filterList(res.GetReleases())

	result := getListResult(rels, res.Next)

	return &result, nil

}

// filterList returns a list scrubbed of old releases.
func filterList(rels []*release.Release) []*release.Release {
	idx := map[string]int32{}

	for _, r := range rels {
		name, version := r.GetName(), r.GetVersion()
		if max, ok := idx[name]; ok {
			// check if we have a greater version already
			if max > version {
				continue
			}
		}
		idx[name] = version
	}

	uniq := make([]*release.Release, 0, len(idx))
	for _, r := range rels {
		if idx[r.GetName()] == r.GetVersion() {
			uniq = append(uniq, r)
		}
	}
	return uniq
}

// statusCodes gets the list of status codes that are to be included in the results.
func (l *listCmd) statusCodes() []release.Status_Code {
	if l.all {
		return []release.Status_Code{
			release.Status_UNKNOWN,
			release.Status_DEPLOYED,
			release.Status_DELETED,
			release.Status_DELETING,
			release.Status_FAILED,
			release.Status_PENDING_INSTALL,
			release.Status_PENDING_UPGRADE,
			release.Status_PENDING_ROLLBACK,
		}
	}
	status := []release.Status_Code{}
	if l.deployed {
		status = append(status, release.Status_DEPLOYED)
	}
	if l.deleted {
		status = append(status, release.Status_DELETED)
	}
	if l.deleting {
		status = append(status, release.Status_DELETING)
	}
	if l.failed {
		status = append(status, release.Status_FAILED)
	}
	if l.superseded {
		status = append(status, release.Status_SUPERSEDED)
	}
	if l.pending {
		status = append(status, release.Status_PENDING_INSTALL, release.Status_PENDING_UPGRADE, release.Status_PENDING_ROLLBACK)
	}

	// Default case.
	if len(status) == 0 {
		status = append(status, release.Status_DEPLOYED, release.Status_FAILED)
	}
	return status
}

func getListResult(rels []*release.Release, next string) HelmListResult {
	listReleases := []listRelease{}
	for _, r := range rels {
		md := r.GetChart().GetMetadata()
		t := "-"
		if tspb := r.GetInfo().GetLastDeployed(); tspb != nil {
			t = timeconv.String(tspb)
		}

		lr := listRelease{
			Name:       r.GetName(),
			Revision:   r.GetVersion(),
			Updated:    t,
			Status:     r.GetInfo().GetStatus().GetCode().String(),
			Chart:      fmt.Sprintf("%s-%s", md.GetName(), md.GetVersion()),
			AppVersion: md.GetAppVersion(),
			Namespace:  r.GetNamespace(),
		}
		listReleases = append(listReleases, lr)
	}

	return HelmListResult{
		Releases: listReleases,
		Next:     next,
	}
}

func shortenListResult(result HelmListResult) []string {
	names := []string{}
	for _, r := range result.Releases {
		names = append(names, r.Name)
	}

	return names
}

func formatResult(format string, short bool, result HelmListResult, colWidth uint) (string, error) {
	var output string
	var err error

	var shortResult []string
	var finalResult interface{}
	if short {
		shortResult = shortenListResult(result)
		finalResult = shortResult
	} else {
		finalResult = result
	}

	switch format {
	case "":
		if short {
			output = formatTextShort(shortResult)
		} else {
			output = formatText(result, colWidth)
		}
	case "json":
		o, e := json.Marshal(finalResult)
		if e != nil {
			err = fmt.Errorf("Failed to Marshal JSON output: %s", e)
		} else {
			output = string(o)
		}
	case "yaml":
		o, e := yaml.Marshal(finalResult)
		if e != nil {
			err = fmt.Errorf("Failed to Marshal YAML output: %s", e)
		} else {
			output = string(o)
		}
	default:
		err = fmt.Errorf("Unknown output format \"%s\"", format)
	}
	return output, err
}

func formatText(result HelmListResult, colWidth uint) string {
	nextOutput := ""
	if result.Next != "" {
		nextOutput = fmt.Sprintf("\tnext: %s\n", result.Next)
	}

	table := uitable.New()
	table.MaxColWidth = colWidth
	table.AddRow("NAME", "REVISION", "UPDATED", "STATUS", "CHART", "APP VERSION", "NAMESPACE")
	for _, lr := range result.Releases {
		table.AddRow(lr.Name, lr.Revision, lr.Updated, lr.Status, lr.Chart, lr.AppVersion, lr.Namespace)
	}

	return fmt.Sprintf("%s%s", nextOutput, table.String())
}

func formatTextShort(shortResult []string) string {
	return strings.Join(shortResult, "\n")
}
