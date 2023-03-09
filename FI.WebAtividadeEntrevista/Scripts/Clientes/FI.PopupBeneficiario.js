var beneficiarios = [];
$(document).ready(function () {
    quantItens = $("#QuantidadeBeneficiarios").val()
    $('.CPF').inputmask("999.999.999-99");
    povoarLista();
    
});

function ExcluirBeneficiario(index) {
    $("#Beneficiario" + index).fadeOut(500, function () {
        $(this).remove();
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
    var beneficiario = { CPF: cpf, Nome: nome };
    beneficiarios.push(beneficiario);
    
    // Percorra todos os elementos de CPF e nome e adicione-os a um objeto BeneficiarioModel
/*    $('.GridCPFBeneficiario').each(function (index, element) {
        var cpfrequest = $(element).val();
        cpfrequest = cpfrequest.replace(/\D/g, '');
        var nome = $(`.GridNomeBeneficiario:eq(${index})`).val();
        
        
    });*/

    $.ajax({
        url: urlPostBeneficiario,
        method: "POST",
        data: {
            model: {
                "Nome": nome,
                "CPF": $("#CPFBeneficiario").inputmask("unmaskedvalue")
            },
            "Beneficiarios": beneficiarios
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                $('#BeneficiariosGrid').append(novoCampo);
                quantItens++;
                ModalDialog("Sucesso!", r)
                resetarBeneficiario();
                povoarListaBeneficiarios();
            }
    });

}
function EditarBeneficiarioServidor(index) {


    let cpf = $("#CPFBeneficiario"+index).val();
    let nome = $("#NomeBeneficiario"+index).val();
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

    var beneficiarios = [];
    // Percorra todos os elementos de CPF e nome e adicione-os a um objeto BeneficiarioModel
    $('.GridCPFBeneficiario').each(function (index, element) {
        var cpfrequest = $(element).val();
        cpfrequest = cpfrequest.replace(/\D/g, '');
        var nome = $(`.GridNomeBeneficiario:eq(${index})`).val();
        var beneficiario = { CPF: cpfrequest, Nome: nome };
        beneficiarios.push(beneficiario);
    });

    $.ajax({
        url: urlPostBeneficiario,
        method: "POST",
        data: {
            model: {
                "Nome": nome,
                "CPF": $("#CPFBeneficiario").inputmask("unmaskedvalue")
            },
            "Beneficiarios": beneficiarios
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                editarBeneficiario(index);
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
    var beneficiarios = [];
    $('.GridCPFBeneficiario').each(function (index, element) {
        var cpfrequest = $(element).val();
        cpfrequest = cpfrequest.replace(/\D/g, '');
        var nome = $(`.GridNomeBeneficiario:eq(${index})`).val();
        var beneficiario = { CPF: cpfrequest, Nome: nome };
        beneficiarios.push(beneficiario);
    });
    var objeto_serializado = JSON.stringify(beneficiarios);
    $("#ConteudoPopup").val(objeto_serializado);
}
function povoarLista() {
    var jsonObj = JSON.parse($("#ConteudoPopup").val());
    if (jsonObj == '0') {
        jsonObj = null;
    }
        for (var i = 0; i < obj.length; i++) {
            quantItens++;
            var benef = obj[i];
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
        $("#CPFBeneficiario" + index).css("background-color", "white");
        $("#NomeBeneficiario" + index).css("background-color", "white");
        $("#CPFBeneficiario" + index).removeAttr("disabled");
        $("#NomeBeneficiario" + index).removeAttr("disabled");
        $("#AlterarBeneficiario" + index).off();
        $("#AlterarBeneficiario" + index).removeClass("btn-primary").addClass("btn-success").html("OK!").click(EditarBeneficiarioServidor(index)).append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
    } else {
        $("#CPFBeneficiario" + index).css("background-color", "#F5F5F5");
        $("#NomeBeneficiario" + index).css("background-color", "#F5F5F5");
        $("#CPFBeneficiario" + index).prop("disabled", true);
        $("#NomeBeneficiario" + index).prop("disabled", true);
        $("#AlterarBeneficiario" + index).off();
        $("#AlterarBeneficiario" + index).removeClass("btn-succes").addClass("btn-primary").html("Alterar").click(editarBeneficiario(index)).find(".glyphicon-ok").remove();;
    }
    
}