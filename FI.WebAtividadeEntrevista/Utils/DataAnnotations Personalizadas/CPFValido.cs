using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Text.RegularExpressions;

public class CPFValido : ValidationAttribute
{

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        try
        {
            if (value == null)
            {
                return new ValidationResult(ConstantesMensagensCPFValido.s_preenchaCPF);
            }
            string cpf = value.ToString();

            if (string.IsNullOrWhiteSpace(cpf))
                return new ValidationResult(ConstantesMensagensCPFValido.s_preenchaCPF);

            //Removendo a máscara por padrão (porém no caso já está vindo para cá sem máscara)
            cpf = cpf.Trim().Replace(".", "").Replace("-", "");

            bool? algarismosIguais = AlgarismosIguais(cpf);

            if (algarismosIguais == true)
                return new ValidationResult(ConstantesMensagensCPFValido.s_erroDigitosVerificadoresCPF);
            else
            if (algarismosIguais == null)
                throw new Exception(ConstantesMensagensCPFValido.s_erroValidarAlgarismosCPF);

            if (cpf.Length != 11)
                return new ValidationResult(ConstantesMensagensCPFValido.s_tamanhoInvalidoCPF);

            if (!long.TryParse(cpf, out var cpfNumerico))
                return new ValidationResult(ConstantesMensagensCPFValido.s_erroConversaoCPF);


            //Cálculo padrão de verificação do dígito verificador de CPF
            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;

            tempCpf = cpf.Substring(0, 9);
            soma = 0;

            // Calcula o primeiro dígito verificador
            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCpf = tempCpf + digito;
            soma = 0;

            // Calcula o segundo dígito verificador
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();

            //Verifica a validade do CPF
            if (cpf.EndsWith(digito))
                return ValidationResult.Success;
            else
                return new ValidationResult(ConstantesMensagensCPFValido.s_erroDigitosVerificadoresCPF);

        }
        catch (Exception ex)
        {
            using (StreamWriter w = File.AppendText("log.txt"))
            {
                w.WriteLine("Data e Hora:" + DateTime.Now + $"\n\nErro: {ex.Message}\n\n");
            }
            return new ValidationResult(ConstantesMensagensCPFValido.s_erroException);
        }
    }
    protected bool? AlgarismosIguais(string cpf)
    {
        try
        {
            switch (cpf)
            {
                case "11111111111":
                    return true;
                case "00000000000":
                    return true;
                case "2222222222":
                    return true;
                case "33333333333":
                    return true;
                case "44444444444":
                    return true;
                case "55555555555":
                    return true;
                case "66666666666":
                    return true;
                case "77777777777":
                    return true;
                case "88888888888":
                    return true;
                case "99999999999":
                    return true;
            }
            return false;
        }
        catch (Exception ex)
        {
            using (StreamWriter w = File.AppendText("log.txt"))
            {
                w.WriteLine("Data e Hora:" + DateTime.Now + $"\n\nErro: {ex.Message}\n\n");
            }
            return null;
        }
    }

}

