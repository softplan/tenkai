package helmapi

import (
	"fmt"
	"io"
	"strconv"

	"github.com/spf13/cobra"

	"k8s.io/helm/pkg/helm"
)

const rollbackDesc = ``

type rollbackCmd struct {
	name          string
	revision      int32
	dryRun        bool
	recreate      bool
	force         bool
	disableHooks  bool
	out           io.Writer
	client        helm.Interface
	timeout       int64
	wait          bool
	description   string
	cleanupOnFail bool
}

func newRollbackCmd(c helm.Interface, out io.Writer) *cobra.Command {
	rollback := &rollbackCmd{
		out:    out,
		client: c,
	}

	cmd := &cobra.Command{
		Use:     "rollback [flags] [RELEASE] [REVISION]",
		Short:   "roll back a release to a previous revision",
		Long:    rollbackDesc,
		PreRunE: func(_ *cobra.Command, _ []string) error { return setupConnection() },
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := checkArgsLength(len(args), "release name", "revision number"); err != nil {
				return err
			}

			rollback.name = args[0]

			v64, err := strconv.ParseInt(args[1], 10, 32)
			if err != nil {
				return fmt.Errorf("invalid revision number '%q': %s", args[1], err)
			}

			rollback.revision = int32(v64)
			rollback.client = ensureHelmClient(rollback.client)
			return rollback.run()
		},
	}

	f := cmd.Flags()
	settings.AddFlagsTLS(f)
	f.BoolVar(&rollback.dryRun, "dry-run", false, "simulate a rollback")
	f.BoolVar(&rollback.recreate, "recreate-pods", false, "performs pods restart for the resource if applicable")
	f.BoolVar(&rollback.force, "force", false, "force resource update through delete/recreate if needed")
	f.BoolVar(&rollback.disableHooks, "no-hooks", false, "prevent hooks from running during rollback")
	f.Int64Var(&rollback.timeout, "timeout", 300, "time in seconds to wait for any individual Kubernetes operation (like Jobs for hooks)")
	f.BoolVar(&rollback.wait, "wait", false, "if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment are in a ready state before marking the release as successful. It will wait for as long as --timeout")
	f.StringVar(&rollback.description, "description", "", "specify a description for the release")
	f.BoolVar(&rollback.cleanupOnFail, "cleanup-on-fail", false, "allow deletion of new resources created in this rollback when rollback failed")

	// set defaults from environment
	settings.InitTLS(f)

	return cmd
}

func (r *rollbackCmd) run() error {
	_, err := r.client.RollbackRelease(
		r.name,
		helm.RollbackDryRun(r.dryRun),
		helm.RollbackRecreate(r.recreate),
		helm.RollbackForce(r.force),
		helm.RollbackDisableHooks(r.disableHooks),
		helm.RollbackVersion(r.revision),
		helm.RollbackTimeout(r.timeout),
		helm.RollbackWait(r.wait),
		helm.RollbackDescription(r.description),
		helm.RollbackCleanupOnFail(r.cleanupOnFail))
	if err != nil {
		return prettyError(err)
	}

	fmt.Fprintf(r.out, "Rollback was a success.\n")

	return nil
}
