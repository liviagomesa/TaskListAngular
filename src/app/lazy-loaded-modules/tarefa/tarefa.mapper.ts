import { ParamsBusca } from "src/app/provided-in-root/params-busca.model";

export function mapQpToParamsBusca(qp: any): ParamsBusca {
  let params: ParamsBusca = {
    page: Number(qp['page'] ?? 1)
  };

  if (qp['sort']) {
    params.sort = qp['sort'];
  }

  if (qp['concluida'] !== undefined) {
    params.filters = [{
      propriedade: "concluida",
      condicao: "equals",
      valor: qp['concluida']
    }];
  }

  return params;
}
