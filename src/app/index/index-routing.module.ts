import { NgModule } from "@angular/core";
import { IndexComponent } from "./index.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
    children: [
      { path: "", redirectTo: "produtos", pathMatch: "full" },
      {
        path: 'produtos',
        loadChildren: () =>
          import('../modules/produtos/produtos.module').then(
            (m) => m.ProdutosModule
          ),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('../modules/categorias/categorias.module').then(
            (m) => m.CategoriasModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexRoutingModule {}
