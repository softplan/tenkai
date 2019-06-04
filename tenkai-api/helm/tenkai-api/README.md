# [ALTERAR-NOME-DO-SERVICO] Helm Chart

Este chart faz deploy do [ALTERAR-NOME-DO-SERVICO] que é o serviço responsável por...

## Pré-requisitos
* [Helm](https://helm.sh/) >= 2.9.1
* Kubernetes 1.10.0

## Instalando o Chart
~~~bash
    helm upgrade --install --recreate-pods \
    --set "istio.gateways[0]=\"${TJ_ISTIO_GATEWAY}\"" \
    --set "istio.hosts[0]=\"${NAMESPACE}.saj6.softplan.com.br\"" \
    --force --namespace=${NAMESPACE} \
    [ALTERAR-NOME-DO-CHART]-${NAMESPACE} \
    stable/[ALTERAR-NOME-DO-CHART]
~~~


## Configuração

| Parametro | Descrição | Padrão |
| --------- | ----------- | ------- |
| `replicaCount` | Quantidade de réplicas (pods) | 1 |
| `image.repository` | Caminho da imagem docker do serviço [ALTERAR-NOME-DO-SERVICO] | docker-unj-repo.softplan.com.br/unj/[ALTERAR-NOME-DA-IMAGEM] |
| `image.tag` | Tag da imagem docker do serviço [ALTERAR-NOME-DO-SERVICO] | master |
| `image.pullPolicy` | Estratégia de atualização da imagem docker [[Documentação](https://kubernetes.io/docs/concepts/containers/images/#updating-images)] | Always |
| `service.type` | Define como o serviço será exposto. [[Documentação](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)] | ClusterIP |
| `service.port` | Define em que porta o serviço será exposto | 80 |
| `app.pullSecret` | Credencial para acessar o docker registry | unjregistry |
| `app.[ALTERAR_VAR_1]` | [ALTERAR_DESCRICAO_DA_VARIÁVEL_1] | [ALTERAR_VALOR_DEFAULT_DA_VARIAVEL_1] |
| `app.[ALTERAR_VAR_2]` | [ALTERAR_DESCRICAO_DA_VARIÁVEL_2] | [ALTERAR_VALOR_DEFAULT_DA_VARIAVEL_2] |
| `istio.enabled` | Habilita/desabilita o istio | true |
| `istio.gateways` | Gateway padrão do istio | istio-gateway |
| `istio.hosts` | Domínio das aplicações SAJ6 | "xwing.saj6.softplan.com.br" |
| `istio.apiPath` | Caminho da aplicação | /[ALTERAR_CONTEXT_PATH] |
