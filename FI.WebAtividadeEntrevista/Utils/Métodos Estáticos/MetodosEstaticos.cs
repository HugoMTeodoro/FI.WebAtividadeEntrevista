using System;
using System.IO;

public static class MetodosEstaticos
{
    public static string MascararCPF(string cpf)
    {
        try
        {
            cpf = cpf.Insert(3, ".").Insert(7, ".").Insert(11, "-");
            return cpf;
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