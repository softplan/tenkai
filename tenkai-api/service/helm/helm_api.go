package helmapi

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"github.com/spf13/cobra"
	"google.golang.org/grpc/grpclog"
	"google.golang.org/grpc/status"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	// Import to initialize client auth plugins.
	_ "k8s.io/client-go/plugin/pkg/client/auth"

	"k8s.io/helm/pkg/helm"
	helm_env "k8s.io/helm/pkg/helm/environment"
	"k8s.io/helm/pkg/helm/portforwarder"
	"k8s.io/helm/pkg/kube"
	"k8s.io/helm/pkg/tlsutil"
)

var (
	tillerTunnel *kube.Tunnel
	settings     helm_env.EnvSettings
)

func newRootCmd(args []string) *cobra.Command {
	cmd := &cobra.Command{
		Use:          "helm",
		Short:        "The Helm package manager for Kubernetes.",
		Long:         "",
		SilenceUsage: true,
		PersistentPreRun: func(*cobra.Command, []string) {
			if settings.TLSCaCertFile == helm_env.DefaultTLSCaCert || settings.TLSCaCertFile == "" {
				settings.TLSCaCertFile = settings.Home.TLSCaCert()
			} else {
				settings.TLSCaCertFile = os.ExpandEnv(settings.TLSCaCertFile)
			}
			if settings.TLSCertFile == helm_env.DefaultTLSCert || settings.TLSCertFile == "" {
				settings.TLSCertFile = settings.Home.TLSCert()
			} else {
				settings.TLSCertFile = os.ExpandEnv(settings.TLSCertFile)
			}
			if settings.TLSKeyFile == helm_env.DefaultTLSKeyFile || settings.TLSKeyFile == "" {
				settings.TLSKeyFile = settings.Home.TLSKey()
			} else {
				settings.TLSKeyFile = os.ExpandEnv(settings.TLSKeyFile)
			}
		},
		PersistentPostRun: func(*cobra.Command, []string) {
			teardown()
		},
	}
	flags := cmd.PersistentFlags()

	settings.AddFlags(flags)

	//out := cmd.OutOrStdout()
	/*
		cmd.AddCommand(
			// chart commands
			newCreateCmd(out),
			newDependencyCmd(out),
			newFetchCmd(out),
			newInspectCmd(out),
			newLintCmd(out),
			newPackageCmd(out),
			newRepoCmd(out),
			newSearchCmd(out),
			newServeCmd(out),
			newVerifyCmd(out),

			// release commands
			newDeleteCmd(nil, out),
			newGetCmd(nil, out),
			newHistoryCmd(nil, out),
			newInstallCmd(nil, out),
			newListCmd(nil, out),
			newRollbackCmd(nil, out),
			newStatusCmd(nil, out),
			newUpgradeCmd(nil, out),

			newReleaseTestCmd(nil, out),
			newResetCmd(nil, out),
			newVersionCmd(nil, out),

			newCompletionCmd(out),
			newHomeCmd(out),
			newInitCmd(out),
			newPluginCmd(out),
			newTemplateCmd(out),

			// Hidden documentation generator command: 'helm docs'
			newDocsCmd(out),

			// Deprecated
			markDeprecated(newRepoUpdateCmd(out), "use 'helm repo update'\n"),
		)
	*/
	flags.Parse(args)

	// set defaults from environment
	settings.Init(flags)

	// Find and add plugins
	//loadPlugins(cmd, out)

	return cmd
}

func init() {
	// Tell gRPC not to log to console.
	grpclog.SetLogger(log.New(ioutil.Discard, "", log.LstdFlags))
}

func markDeprecated(cmd *cobra.Command, notice string) *cobra.Command {
	cmd.Deprecated = notice
	return cmd
}

func Testk() {
	cmd := newRootCmd(os.Args[1:])
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func setupConnection() error {
	if settings.TillerHost == "" {
		config, client, err := getKubeClient(settings.KubeContext, settings.KubeConfig)
		if err != nil {
			return err
		}

		tillerTunnel, err = portforwarder.New(settings.TillerNamespace, client, config)
		if err != nil {
			return err
		}

		settings.TillerHost = fmt.Sprintf("127.0.0.1:%d", tillerTunnel.Local)
	}

	// Plugin support.
	return nil
}

func teardown() {
	if tillerTunnel != nil {
		tillerTunnel.Close()
	}
}

func checkArgsLength(argsReceived int, requiredArgs ...string) error {
	expectedNum := len(requiredArgs)
	if argsReceived != expectedNum {
		arg := "arguments"
		if expectedNum == 1 {
			arg = "argument"
		}
		return fmt.Errorf("This command needs %v %s: %s", expectedNum, arg, strings.Join(requiredArgs, ", "))
	}
	return nil
}

// prettyError unwraps or rewrites certain errors to make them more user-friendly.
func prettyError(err error) error {
	// Add this check can prevent the object creation if err is nil.
	if err == nil {
		return nil
	}
	// If it's grpc's error, make it more user-friendly.
	if s, ok := status.FromError(err); ok {
		return fmt.Errorf(s.Message())
	}
	// Else return the original error.
	return err
}

// configForContext creates a Kubernetes REST client configuration for a given kubeconfig context.
func configForContext(context string, kubeconfig string) (*rest.Config, error) {
	config, err := kube.GetConfig(context, kubeconfig).ClientConfig()
	if err != nil {
		return nil, fmt.Errorf("could not get Kubernetes config for context %q: %s", context, err)
	}
	return config, nil
}

// getKubeClient creates a Kubernetes config and client for a given kubeconfig context.
func getKubeClient(context string, kubeconfig string) (*rest.Config, kubernetes.Interface, error) {
	config, err := configForContext(context, kubeconfig)
	if err != nil {
		return nil, nil, err
	}
	client, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, nil, fmt.Errorf("could not get Kubernetes client: %s", err)
	}
	return config, client, nil
}

// ensureHelmClient returns a new helm client impl. if h is not nil.
func ensureHelmClient(h helm.Interface) helm.Interface {
	if h != nil {
		return h
	}
	return newClient()
}

func newClient() helm.Interface {
	options := []helm.Option{helm.Host(settings.TillerHost), helm.ConnectTimeout(settings.TillerConnectionTimeout)}

	if settings.TLSVerify || settings.TLSEnable {
		tlsopts := tlsutil.Options{
			ServerName:         settings.TLSServerName,
			KeyFile:            settings.TLSKeyFile,
			CertFile:           settings.TLSCertFile,
			InsecureSkipVerify: true,
		}
		if settings.TLSVerify {
			tlsopts.CaCertFile = settings.TLSCaCertFile
			tlsopts.InsecureSkipVerify = false
		}
		tlscfg, err := tlsutil.ClientConfig(tlsopts)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(2)
		}
		options = append(options, helm.WithTLS(tlscfg))
	}
	return helm.NewClient(options...)
}
