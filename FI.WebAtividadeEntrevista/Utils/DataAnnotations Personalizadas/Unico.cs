using FI.AtividadeEntrevista.BLL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Text;

namespace WebAtividadeEntrevista.Utils.DataAnnotations_Personalizadas
{
    public class Unico : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            try
            {
                string cpf = value.ToString();
                BoCliente bo = new BoCliente();
                bool existe = bo.VerificarExistencia(cpf);
                if (existe)
                {
                    return new ValidationResult(ConstantesMensagensCPFValido.s_erroCPFExistente);
                }
                return ValidationResult.Success;
            }
            catch (Exception ex)
            {
                using (StreamWriter w = File.AppendText("log.txt"))
                {
                    w.WriteLine("Data e Hora:" + DateTime.Now + $"\n\nErro: {ex.Message}\n\n *****\n\n");
                }
                return new ValidationResult(ConstantesMensagensCPFValido.s_erroException);
            }
        }
    }
}