using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Validar(BeneficiarioModel model, List<BeneficiarioModel> Beneficiarios)
        {
            BoBeneficiario bo = new BoBeneficiario();
            if (Beneficiarios != null)
            {
                List<Beneficiario> beneficiariosEntidade = ConverterModel(Beneficiarios);
                if (bo.VerificarInconsistencia(new Beneficiario { CPF = model.CPF, Nome = model.Nome }, beneficiariosEntidade))
                {
                    ModelState.AddModelError("Beneficiário", ConstantesMensagensBeneficiario.s_BeneficiarioDuplicado);
                }
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }



            return Json("Beneficiário Inserido com Sucesso");
        }
        


        public List<Beneficiario> ConverterModel(List<BeneficiarioModel> model)
        {
            List<Beneficiario> beneficiarios = new List<Beneficiario>();
            foreach (BeneficiarioModel beneficiario in model)
            {
                Beneficiario ben = new Beneficiario { CPF = beneficiario.CPF, Id = beneficiario.Id, IDCLIENTE = beneficiario.IDCLIENTE, Nome = beneficiario.Nome };
                beneficiarios.Add(ben);
            }
            return beneficiarios;
        }
    }
}