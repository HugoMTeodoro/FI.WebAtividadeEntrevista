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
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteCreateEdit model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBen = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {

                model.Id = bo.Incluir(new Cliente()
                {
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                foreach (BeneficiarioModel ben in model.Beneficiarios)
                {
                    boBen.Incluir(new Beneficiario { CPF = ben.CPF, IDCLIENTE = model.Id, Nome = ben.Nome });
                }

                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModelEdit model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBen = new BoBeneficiario();
            bool haRepeticoes = false;
            List<Beneficiario> beneficiariosBd = boBen.Consultar(model.Id);
            foreach (Beneficiario b in beneficiariosBd)
            {
                BeneficiarioModel benefFront = model.Beneficiarios.Where(x=> x.CPF==b.CPF && x.IDCLIENTE== model.Id).FirstOrDefault();
                if (benefFront == null)
                {
                    boBen.Excluir(b.Id);
                }
            }
            if (model.Beneficiarios != null)
                haRepeticoes = model.Beneficiarios.GroupBy(p => p.CPF).Any(g => g.Count() > 1);
            if (haRepeticoes)
            {
                ModelState.AddModelError("Beneficiário", ConstantesMensagensBeneficiario.s_BeneficiarioDuplicado);
            }
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });
                if (model.Beneficiarios != null)
                {
                    foreach (BeneficiarioModel ben in model.Beneficiarios)
                    {

                        boBen.Alterar(new Beneficiario { CPF = ben.CPF, IDCLIENTE = model.Id, Nome = ben.Nome });
                    }
                }
                
                return Json("Cadastro alterado com sucesso");
            }
        }
        public List<BeneficiarioModel> ConverterModel(List<Beneficiario> model)
        {
            List<BeneficiarioModel> beneficiarios = new List<BeneficiarioModel>();
            foreach (Beneficiario beneficiario in model)
            {
                BeneficiarioModel ben = new BeneficiarioModel { CPF = beneficiario.CPF, Id = beneficiario.Id, IDCLIENTE = beneficiario.IDCLIENTE, Nome = beneficiario.Nome };
                beneficiarios.Add(ben);
            }
            return beneficiarios;
        }


        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBeneficiario = new BoBeneficiario();
            Cliente cliente = bo.Consultar(id);
            List<Beneficiario> beneficiarios = boBeneficiario.Consultar(cliente.Id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModelEdit()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF,
                    Beneficiarios = ConverterModel(beneficiarios)
                };


            }

            return View(model);
        }
        [HttpGet]
        public ActionResult BeneficiariosPopup()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}