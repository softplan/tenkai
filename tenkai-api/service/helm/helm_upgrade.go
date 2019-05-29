package helmapi

import (
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/spf13/cobra"

	"k8s.io/helm/pkg/chartutil"
	"k8s.io/helm/pkg/helm"
	"k8s.io/helm/pkg/renderutil"
	storageerrors "k8s.io/helm/pkg/storage/errors"
)

const upgradeDesc = ``

type valueFiles []string

type upgradeCmd struct {
	release       string
	chart         string
	out           io.Writer
	client        helm.Interface
	dryRun        bool
	recreate      bool
	force         bool
	disableHooks  bool
	valueFiles    valueFiles
	values        []string
	stringValues  []string
	fileValues    []string
	verify        bool
	keyring       string
	install       bool
	namespace     string
	version       string
	timeout       int64
	resetValues   bool
	reuseValues   bool
	wait          bool
	atomic        bool
	repoURL       string
	username      string
	password      string
	devel         bool
	subNotes      bool
	description   string
	cleanupOnFail bool

	certFile string
	keyFile  string
	caFile   string
}

//HelmUpgrade Method
func Upgrade(namespace string, release string, chart string, variables []string) {

	settings.Home = "/home/denny/.helm"
	settings.TillerNamespace = "kube-system"
	settings.TLSEnable = false
	settings.TLSVerify = false
	settings.TillerConnectionTimeout = 1200

	upgrade := &upgradeCmd{out: os.Stdout}
	setupConnection()
	upgrade.client = newClient()
	upgrade.version = ">0.0.0-0"

	upgrade.namespace = namespace
	upgrade.install = true
	upgrade.recreate = true
	upgrade.force = true
	upgrade.release = release
	upgrade.chart = chart
	upgrade.values = variables
	upgrade.client = ensureHelmClient(upgrade.client)
	upgrade.wait = upgrade.wait || upgrade.atomic

	upgrade.run()

	teardown()
	settings.TillerHost = ""

}

func newUpgradeCmd(client helm.Interface, out io.Writer) *cobra.Command {

	upgrade := &upgradeCmd{
		out:    out,
		client: client,
	}

	cmd := &cobra.Command{
		Use:     "upgrade [RELEASE] [CHART]",
		Short:   "upgrade a release",
		Long:    upgradeDesc,
		PreRunE: func(_ *cobra.Command, _ []string) error { return setupConnection() },
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := checkArgsLength(len(args), "release name", "chart path"); err != nil {
				return err
			}

			if upgrade.version == "" && upgrade.devel {
				upgrade.version = ">0.0.0-0"
			}

			upgrade.release = args[0]
			upgrade.chart = args[1]
			upgrade.client = ensureHelmClient(upgrade.client)
			upgrade.wait = upgrade.wait || upgrade.atomic

			return upgrade.run()
		},
	}

	f := cmd.Flags()
	settings.AddFlagsTLS(f)
	f.VarP(&upgrade.valueFiles, "values", "f", "specify values in a YAML file or a URL(can specify multiple)")
	f.BoolVar(&upgrade.dryRun, "dry-run", false, "simulate an upgrade")
	f.BoolVar(&upgrade.recreate, "recreate-pods", false, "performs pods restart for the resource if applicable")
	f.BoolVar(&upgrade.force, "force", false, "force resource update through delete/recreate if needed")
	f.StringArrayVar(&upgrade.values, "set", []string{}, "set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)")
	f.StringArrayVar(&upgrade.stringValues, "set-string", []string{}, "set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)")
	f.StringArrayVar(&upgrade.fileValues, "set-file", []string{}, "set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)")
	f.BoolVar(&upgrade.disableHooks, "disable-hooks", false, "disable pre/post upgrade hooks. DEPRECATED. Use no-hooks")
	f.BoolVar(&upgrade.disableHooks, "no-hooks", false, "disable pre/post upgrade hooks")
	f.BoolVar(&upgrade.verify, "verify", false, "verify the provenance of the chart before upgrading")
	f.StringVar(&upgrade.keyring, "keyring", defaultKeyring(), "path to the keyring that contains public signing keys")
	f.BoolVarP(&upgrade.install, "install", "i", false, "if a release by this name doesn't already exist, run an install")
	f.StringVar(&upgrade.namespace, "namespace", "", "namespace to install the release into (only used if --install is set). Defaults to the current kube config namespace")
	f.StringVar(&upgrade.version, "version", "", "specify the exact chart version to use. If this is not specified, the latest version is used")
	f.Int64Var(&upgrade.timeout, "timeout", 300, "time in seconds to wait for any individual Kubernetes operation (like Jobs for hooks)")
	f.BoolVar(&upgrade.resetValues, "reset-values", false, "when upgrading, reset the values to the ones built into the chart")
	f.BoolVar(&upgrade.reuseValues, "reuse-values", false, "when upgrading, reuse the last release's values and merge in any overrides from the command line via --set and -f. If '--reset-values' is specified, this is ignored.")
	f.BoolVar(&upgrade.wait, "wait", false, "if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment are in a ready state before marking the release as successful. It will wait for as long as --timeout")
	f.BoolVar(&upgrade.atomic, "atomic", false, "if set, upgrade process rolls back changes made in case of failed upgrade, also sets --wait flag")
	f.StringVar(&upgrade.repoURL, "repo", "", "chart repository url where to locate the requested chart")
	f.StringVar(&upgrade.username, "username", "", "chart repository username where to locate the requested chart")
	f.StringVar(&upgrade.password, "password", "", "chart repository password where to locate the requested chart")
	f.StringVar(&upgrade.certFile, "cert-file", "", "identify HTTPS client using this SSL certificate file")
	f.StringVar(&upgrade.keyFile, "key-file", "", "identify HTTPS client using this SSL key file")
	f.StringVar(&upgrade.caFile, "ca-file", "", "verify certificates of HTTPS-enabled servers using this CA bundle")
	f.BoolVar(&upgrade.devel, "devel", false, "use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored.")
	f.BoolVar(&upgrade.subNotes, "render-subchart-notes", false, "render subchart notes along with parent")
	f.StringVar(&upgrade.description, "description", "", "specify the description to use for the upgrade, rather than the default")
	f.BoolVar(&upgrade.cleanupOnFail, "cleanup-on-fail", false, "allow deletion of new resources created in this upgrade when upgrade failed")

	f.MarkDeprecated("disable-hooks", "use --no-hooks instead")

	// set defaults from environment
	settings.InitTLS(f)

	return cmd
}

func (u *upgradeCmd) run() error {
	chartPath, err := locateChartPath(u.repoURL, u.username, u.password, u.chart, u.version, u.verify, u.keyring, u.certFile, u.keyFile, u.caFile)
	if err != nil {
		return err
	}

	releaseHistory, err := u.client.ReleaseHistory(u.release, helm.WithMaxHistory(1))

	if u.install {
		// If a release does not exist, install it. If another error occurs during
		// the check, ignore the error and continue with the upgrade.
		//
		// The returned error is a grpc.rpcError that wraps the message from the original error.
		// So we're stuck doing string matching against the wrapped error, which is nested somewhere
		// inside of the grpc.rpcError message.

		if err == nil {
			if u.namespace == "" {
				u.namespace = defaultNamespace()
			}
			previousReleaseNamespace := releaseHistory.Releases[0].Namespace
			if previousReleaseNamespace != u.namespace {
				fmt.Fprintf(u.out,
					"WARNING: Namespace %q doesn't match with previous. Release will be deployed to %s\n",
					u.namespace, previousReleaseNamespace,
				)
			}
		}

		if err != nil && strings.Contains(err.Error(), storageerrors.ErrReleaseNotFound(u.release).Error()) {
			fmt.Fprintf(u.out, "Release %q does not exist. Installing it now.\n", u.release)
			ic := &installCmd{
				chartPath:    chartPath,
				client:       u.client,
				out:          u.out,
				name:         u.release,
				valueFiles:   u.valueFiles,
				dryRun:       u.dryRun,
				verify:       u.verify,
				disableHooks: u.disableHooks,
				keyring:      u.keyring,
				values:       u.values,
				stringValues: u.stringValues,
				fileValues:   u.fileValues,
				namespace:    u.namespace,
				timeout:      u.timeout,
				wait:         u.wait,
				description:  u.description,
				atomic:       u.atomic,
			}
			return ic.run()
		}
	}

	rawVals, err := vals(u.valueFiles, u.values, u.stringValues, u.fileValues, u.certFile, u.keyFile, u.caFile)
	if err != nil {
		return err
	}

	// Check chart requirements to make sure all dependencies are present in /charts
	ch, err := chartutil.Load(chartPath)
	if err == nil {
		if req, err := chartutil.LoadRequirements(ch); err == nil {
			if err := renderutil.CheckDependencies(ch, req); err != nil {
				return err
			}
		} else if err != chartutil.ErrRequirementsNotFound {
			return fmt.Errorf("cannot load requirements: %v", err)
		}
	} else {
		return prettyError(err)
	}

	resp, err := u.client.UpdateReleaseFromChart(
		u.release,
		ch,
		helm.UpdateValueOverrides(rawVals),
		helm.UpgradeDryRun(u.dryRun),
		helm.UpgradeRecreate(u.recreate),
		helm.UpgradeForce(u.force),
		helm.UpgradeDisableHooks(u.disableHooks),
		helm.UpgradeTimeout(u.timeout),
		helm.ResetValues(u.resetValues),
		helm.ReuseValues(u.reuseValues),
		helm.UpgradeSubNotes(u.subNotes),
		helm.UpgradeWait(u.wait),
		helm.UpgradeDescription(u.description),
		helm.UpgradeCleanupOnFail(u.cleanupOnFail))
	if err != nil {
		fmt.Fprintf(u.out, "UPGRADE FAILED\nError: %v\n", prettyError(err))
		if u.atomic {
			fmt.Fprint(u.out, "ROLLING BACK")
			rollback := &rollbackCmd{
				out:           u.out,
				client:        u.client,
				name:          u.release,
				dryRun:        u.dryRun,
				recreate:      u.recreate,
				force:         u.force,
				timeout:       u.timeout,
				wait:          u.wait,
				description:   "",
				revision:      releaseHistory.Releases[0].Version,
				disableHooks:  u.disableHooks,
				cleanupOnFail: u.cleanupOnFail,
			}
			if err := rollback.run(); err != nil {
				return err
			}
		}
		return fmt.Errorf("UPGRADE FAILED: %v", prettyError(err))
	}

	fmt.Print(resp.Release.Name)
	//if settings.Debug {
	//printRelease(u.out, resp.Release)
	//}

	fmt.Fprintf(u.out, "Release %q has been upgraded.\n", u.release)

	// Print the status like status command does
	/*
		status, err := u.client.ReleaseStatus(u.release)
		if err != nil {
			return prettyError(err)
		}
		PrintStatus(u.out, status)
	*/

	return nil
}
