var beneficiarios = [];

var cpfAnterior;
var nomeAnterior;
$(document).ready(function () {
    quantItens = $("#QuantidadeBeneficiarios").val();
    $('.CPF').inputmask("999.999.999-99");
    povoarLista();

});

function ExcluirBeneficiario(index) {
    let cpf = $("#CPFBeneficiario" +index).val();
    let nome = $("#NomeBeneficiario" + index).val();
    var beneficiarioDeletado = { CPF: cpf.replace(/[.-]/g, ""), Nome: nome };
    beneficiarios = beneficiarios.filter(function (objeto) {
        return objeto.cpf !== beneficiarioDeletado.cpf;
    });
    $("#Beneficiario" + index).fadeOut(500, function () {
        $(this).remove();
        povoarListaBeneficiarios();
    });
    
}
function AdicionarBeneficiario() {


    let cpf = $("#CPFBeneficiario").val();
    let nome = $("#NomeBeneficiario").val();
    var novoCampo = `<div id="Beneficiario${quantItens}" class="grid-item" style="background-color: #F5F5F5;">
    <div class="col-md-4 mx-auto">
        <div class="form-group">
            <input class="form-control GridCPFBeneficiario CPF" required="required" type="text" id="CPFBeneficiario${quantItens}" name="CPFBeneficiario${quantItens}" placeholder="Ex.: 010.011.111-00" style="border: none; background-color: #F5F5F5; color: black; margin-top: 5px " value="${cpf}" disabled>
        </div>
    </div>
    <div class="col-md-4  mx-auto">
        <div class="form-group">
            <input required="required" type="text" class="form-control GridNomeBeneficiario" id="NomeBeneficiario${quantItens}" name="NomeBeneficiario${quantItens}" placeholder="Ex.: João da Silva" maxlength="50" style="border: none; background-color: #F5F5F5; color: black;margin-top:5px" value="${nome}" disabled>
        </div>
    </div>
    <div class="col-md-2  mx-auto">
        <div class="form-group">
            <button id="AlterarBeneficiario${quantItens}" type="button" class="btn btn-sm btn-primary form-control" style="margin-top:5px" onclick="editarBeneficiario('${quantItens}')">Alterar</button>
        </div>
    </div>
    <div class="col-md-2 mx-auto">
        <div class="form-group">
            <button id="ExcluirBeneficiario${quantItens}" type="button" class="btn btn-sm btn-danger form-control" style="margin-top:5px" onclick="ExcluirBeneficiario('${quantItens}')" >Excluir</button>
        </div>
    </div>
</div>`;
    var beneficiarioAux = { CPF: cpf.replace(/[.-]/g, ""), Nome: nome };
    var beneficiariosAtual=[];

    // Percorra todos os elementos de CPF e nome e adicione-os a um objeto BeneficiarioModel
        $('.GridCPFBeneficiario').each(function (index, element) {
            var cpfrequest = $(element).val();
            cpfrequest = cpfrequest.replace(/\D/g, '');
            var nome = $(`.GridNomeBeneficiario:eq(${index})`).val();
            var beneficiarioList = { CPF: cpfrequest, Nome: nome };
            beneficiariosAtual.push(beneficiarioList);
            
        });

    $.ajax({
        url: urlPostBeneficiario,
        method: "POST",
        data: JSON.stringify({
            model: {
                "Nome": nome,
                "CPF": $("#CPFBeneficiario").val().replace(/[.-]/g, ""),
                "Beneficiarios": beneficiariosAtual
            }
        }),
        contentType: 'application/json; charset=utf-8',
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                beneficiarios.push(beneficiarioAux);
                $('#BeneficiariosGrid').append(novoCampo);
                quantItens++;
                ModalDialog("Sucesso!", r)
                resetarBeneficiario();
                povoarListaBeneficiarios();
            }
    });

}
function EditarBeneficiarioServidor(index, cpfAnterior, nomeAnterior) {

    let cpf = $("#CPFBeneficiario" + index).val();
    let nome = $("#NomeBeneficiario" + index).val();
    var beneficiarioConf = { CPF: cpfAnterior, Nome: nomeAnterior };
    var beneficiariosAux = [];
    // Percorra todos os elementos de CPF e nome e adicione-os a um objeto BeneficiarioModel
    /*$('.GridCPFBeneficiario').each(function (index, element) {
        var cpfrequest = $(element).val();
        cpfrequest = cpfrequest.replace(/\D/g, '');
        var nome = $(`.GridNomeBeneficiario:eq(${index})`).val();
        var beneficiario = { CPF: cpfrequest, Nome: nome };
        beneficiariosAux.push(beneficiario);
    });*/
    /*var beneficiariosVal = beneficiariosAux.filter(function (objeto) {
        return JSON.stringify(objeto) !== JSON.stringify(beneficiarioConf);
    });*/
    beneficiariosAux = beneficiarios;
    if (cpf.replace(/\D/g, '') == cpfAnterior) {
        beneficiariosAux = beneficiarios.filter(function (objeto) {
            return objeto.CPF != cpf.replace(/\D/g, '');
        });
    }
    $.ajax({
        url: urlPostBeneficiario,
        method: "POST",
        data: {
            model: {
                "Nome": nome,
                "CPF": $("#CPFBeneficiario" + index).val().replace(/\D/g, ''),
                "Beneficiarios": beneficiariosAux
            }
        },
        error:
            function (r) {
                
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                $("#CPFBeneficiario" + index).val(cpfAnterior).inputmask('999.999.999-99');
                $("#NomeBeneficiario" + index).val(nomeAnterior);
            },
        success:
            function (r) {
                ModalDialog("Sucesso!", r)
                povoarListaBeneficiarios();
            }
    });

}
function resetarBeneficiario() {

    $('#CPFBeneficiario').val('');
    $('#NomeBeneficiario').val('');
}
function povoarListaBeneficiarios() {
    var beneficiariosAux = [];
    $('.GridCPFBeneficiario').each(function (index, element) {
        var cpfrequest = $(element).val().replace(/\D/g, '');
        cpfrequest = cpfrequest.replace(/\D/g, '');
        var nome = $(`.GridNomeBeneficiario:eq(${index})`).val();
        var beneficiario = { CPF: cpfrequest, Nome: nome };
        beneficiariosAux.push(beneficiario);
    });
    var objeto_serializado = JSON.stringify(beneficiariosAux);
    $("#ConteudoPopup").val(objeto_serializado);
}
function povoarLista() {
    var jsonObj = JSON.parse($("#ConteudoPopup").val());
    if (jsonObj == '0') {
        jsonObj = null;
    }
    for (var i = 0; i < jsonObj.length; i++) {
        quantItens++;
        var benef = jsonObj[i];
        var cpf = benef.CPF;
        var nome = benef.Nome;

        // cria um novo conjunto de campos de formulário para o beneficiário
        var novoCampo = `
        <div id="Beneficiario${i}" class="grid-item" style="background-color: #F5F5F5;">
            <div class="col-md-4 mx-auto">
                <div class="form-group">
                    <input class="form-control GridCPFBeneficiario CPF" required="required" type="text" id="CPFBeneficiario${i}" name="CPFBeneficiario${i}" placeholder="Ex.: 010.011.111-00" style="border: none; background-color: #F5F5F5; color: black; margin-top: 5px " value="${cpf}" disabled>
                </div>
            </div>
            <div class="col-md-4 mx-auto">
                <div class="form-group">
                    <input required="required" type="text" class="form-control GridNomeBeneficiario" id="NomeBeneficiario${i}" name="NomeBeneficiario${i}" placeholder="Ex.: João da Silva" maxlength="50" style="border: none; background-color: #F5F5F5; color: black;margin-top:5px" value="${nome}" disabled>
                </div>
            </div>
            <div class="col-md-2 mx-auto">
                <div class="form-group">
                    <button id="AlterarBeneficiario${i}" type="button" class="btn btn-sm btn-primary form-control" style="margin-top:5px" onclick="editarBeneficiario('${i}')">Alterar</button>
                </div>
            </div>
            <div class="col-md-2 mx-auto">
                <div class="form-group">
                    <button id="ExcluirBeneficiario${i}" type="button" class="btn btn-sm btn-danger form-control" style="margin-top:5px" onclick="ExcluirBeneficiario('${i}')">Excluir</button>
                </div>
            </div>
        </div> `;

        // adiciona o novo conjunto de campos ao formulário
        $('#BeneficiariosGrid').append(novoCampo);
    }
}

function editarBeneficiario(index) {
    
    var textoDoBotao = $("#AlterarBeneficiario" + index).text();
    if (textoDoBotao != "OK!") {
        cpfAnterior = $("#CPFBeneficiario" + index).val().replace(/\D/g, '');
        nomeAnterior = $("#NomeBeneficiario" + index).val();
        $("#CPFBeneficiario" + index).css("background-color", "white");
        $("#NomeBeneficiario" + index).css("background-color", "white");
        $("#CPFBeneficiario" + index).removeAttr("disabled");
        $("#NomeBeneficiario" + index).removeAttr("disabled");
        firsttime = 1;
        $("#AlterarBeneficiario" + index).removeClass("btn-primary").addClass("btn-success").html("OK!").append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
    } else {

        $("#CPFBeneficiario" + index).css("background-color", "#F5F5F5");
        $("#NomeBeneficiario" + index).css("background-color", "#F5F5F5");
        $("#CPFBeneficiario" + index).prop("disabled", true);
        $("#NomeBeneficiario" + index).prop("disabled", true);
        $("#AlterarBeneficiario" + index).off();
        EditarBeneficiarioServidor(index, cpfAnterior, nomeAnterior);
        $("#AlterarBeneficiario" + index).removeClass("btn-success").addClass("btn-primary").html("Alterar").find(".glyphicon-ok").remove();//.on('click', EditarBeneficiarioServidor(index));
    }

}