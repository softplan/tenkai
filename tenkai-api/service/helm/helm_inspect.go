package helmapi

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/helm/helm/pkg/downloader"
	"k8s.io/helm/pkg/chartutil"
	"k8s.io/helm/pkg/getter"
	"k8s.io/helm/pkg/proto/hapi/chart"
	"k8s.io/helm/pkg/repo"
	"sigs.k8s.io/yaml"
)

type inspectCmd struct {
	chartpath string
	verify    bool
	keyring   string
	out       io.Writer
	version   string
	repoURL   string
	username  string
	password  string
	devel     bool

	certFile string
	keyFile  string
	caFile   string
}

//GetValues Method
func GetValues(chartName string) ([]byte, error) {

	insp := &inspectCmd{
		out: os.Stdout,
	}

	settings.Home = ".helm"

	if err := insp.prepare(chartName); err != nil {
		return nil, err
	}

	values, _ := insp.run()

	j2, err := yaml.YAMLToJSON([]byte(values.Raw))

	if err != nil {
		fmt.Printf("err: %v\n", err)
		return nil, err
	}

	return j2, nil

}

func (i *inspectCmd) prepare(chart string) error {
	if i.version == "" && i.devel {
		i.version = ">0.0.0-0"
	}

	cp, err := locateChartPath(i.repoURL, i.username, i.password, chart, i.version, i.verify, i.keyring,
		i.certFile, i.keyFile, i.caFile)
	if err != nil {
		return err
	}
	i.chartpath = cp
	return nil
}

func (i *inspectCmd) run() (*chart.Config, error) {
	chrt, err := chartutil.Load(i.chartpath)
	if err != nil {
		return nil, err
	}
	return chrt.Values, nil
}

func locateChartPath(repoURL, username, password, name, version string, verify bool, keyring,
	certFile, keyFile, caFile string) (string, error) {
	name = strings.TrimSpace(name)
	version = strings.TrimSpace(version)
	if fi, err := os.Stat(name); err == nil {
		abs, err := filepath.Abs(name)
		if err != nil {
			return abs, err
		}
		if verify {
			if fi.IsDir() {
				return "", errors.New("cannot verify a directory")
			}
			if _, err := downloader.VerifyChart(abs, keyring); err != nil {
				return "", err
			}
		}
		return abs, nil
	}
	if filepath.IsAbs(name) || strings.HasPrefix(name, ".") {
		return name, fmt.Errorf("path %q not found", name)
	}

	crepo := filepath.Join(settings.Home.Repository(), name)
	if _, err := os.Stat(crepo); err == nil {
		return filepath.Abs(crepo)
	}

	dl := downloader.ChartDownloader{
		HelmHome: settings.Home,
		Out:      os.Stdout,
		Keyring:  keyring,
		Getters:  getter.All(settings),
		Username: username,
		Password: password,
	}
	if verify {
		dl.Verify = downloader.VerifyAlways
	}
	if repoURL != "" {
		chartURL, err := repo.FindChartInAuthRepoURL(repoURL, username, password, name, version,
			certFile, keyFile, caFile, getter.All(settings))
		if err != nil {
			return "", err
		}
		name = chartURL
	}

	if _, err := os.Stat(settings.Home.Archive()); os.IsNotExist(err) {
		os.MkdirAll(settings.Home.Archive(), 0744)
	}

	filename, _, err := dl.DownloadTo(name, version, settings.Home.Archive())
	if err == nil {
		lname, err := filepath.Abs(filename)
		if err != nil {
			return filename, err
		}
		return lname, nil
	} else if settings.Debug {
		return filename, err
	}

	return filename, fmt.Errorf("failed to download %q (hint: running `helm repo update` may help)", name)
}
