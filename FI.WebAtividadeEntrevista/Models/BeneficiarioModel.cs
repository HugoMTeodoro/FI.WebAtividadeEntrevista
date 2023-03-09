using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using WebAtividadeEntrevista.Utils.DataAnnotations_Personalizadas;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Beneficiario
    /// </summary>
    public class BeneficiarioModel
    {
        public long Id { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        [CPFValido]
        public string CPF { get; set; }

        /// <summary>
        /// IDCLIENTE
        /// </summary>
        public long IDCLIENTE { get; set; }

    }
    public class BeneficiariosValidateModel
    {
        /// <summary>
        /// Nome
        /// </summary>
        public string Nome { get; set; }
        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        [CPFValido]
        public string CPF { get; set; }
        /// <summary>
        /// Beneficiarios
        /// </summary>
        public List<BeneficiarioModel> Beneficiarios { get; set; }
    }
}