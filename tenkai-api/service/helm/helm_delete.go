package helmapi

import (
	"errors"
	"fmt"
	"io"

	"github.com/spf13/cobra"

	"k8s.io/helm/pkg/helm"
)

const deleteDesc = ``

type deleteCmd struct {
	name         string
	dryRun       bool
	disableHooks bool
	purge        bool
	timeout      int64
	description  string

	out    io.Writer
	client helm.Interface
}

func newDeleteCmd(c helm.Interface, out io.Writer) *cobra.Command {
	del := &deleteCmd{
		out:    out,
		client: c,
	}

	cmd := &cobra.Command{
		Use:        "delete [flags] RELEASE_NAME [...]",
		Aliases:    []string{"del"},
		SuggestFor: []string{"remove", "rm"},
		Short:      "given a release name, delete the release from Kubernetes",
		Long:       deleteDesc,
		PreRunE:    func(_ *cobra.Command, _ []string) error { return setupConnection() },
		RunE: func(cmd *cobra.Command, args []string) error {
			if len(args) == 0 {
				return errors.New("command 'delete' requires a release name")
			}
			del.client = ensureHelmClient(del.client)

			for i := 0; i < len(args); i++ {
				del.name = args[i]
				if err := del.run(); err != nil {
					return err
				}

				fmt.Fprintf(out, "release \"%s\" deleted\n", del.name)
			}
			return nil
		},
	}

	f := cmd.Flags()
	settings.AddFlagsTLS(f)
	f.BoolVar(&del.dryRun, "dry-run", false, "simulate a delete")
	f.BoolVar(&del.disableHooks, "no-hooks", false, "prevent hooks from running during deletion")
	f.BoolVar(&del.purge, "purge", false, "remove the release from the store and make its name free for later use")
	f.Int64Var(&del.timeout, "timeout", 300, "time in seconds to wait for any individual Kubernetes operation (like Jobs for hooks)")
	f.StringVar(&del.description, "description", "", "specify a description for the release")

	// set defaults from environment
	settings.InitTLS(f)

	return cmd
}

func (d *deleteCmd) run() error {
	opts := []helm.DeleteOption{
		helm.DeleteDryRun(d.dryRun),
		helm.DeleteDisableHooks(d.disableHooks),
		helm.DeletePurge(d.purge),
		helm.DeleteTimeout(d.timeout),
		helm.DeleteDescription(d.description),
	}
	res, err := d.client.DeleteRelease(d.name, opts...)
	if res != nil && res.Info != "" {
		fmt.Fprintln(d.out, res.Info)
	}

	return prettyError(err)
}