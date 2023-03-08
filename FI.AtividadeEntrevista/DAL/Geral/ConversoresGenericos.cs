using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DAL.Geral
{
    internal class ConversoresGenericos
    {
        public List<T> ConversorGenerico<T>(DataSet ds) where T : new()
        {
            List<T> lista = new List<T>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    T obj = new T();
                    Type tipo = obj.GetType();
                    PropertyInfo[] propriedades = tipo.GetProperties();
                    foreach (PropertyInfo propriedade in propriedades)
                    {
                        if (ds.Tables[0].Columns.Contains(propriedade.Name))
                        {
                            object valor = row[propriedade.Name];
                            if (valor != DBNull.Value)
                            {
                                propriedade.SetValue(obj, valor);
                            }
                        }
                    }
                    lista.Add(obj);
                }
            }

            return lista;
        }
    }
}
