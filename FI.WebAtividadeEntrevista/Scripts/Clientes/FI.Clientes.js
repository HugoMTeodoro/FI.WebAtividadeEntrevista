﻿
$(document).ready(function () {
    //Adição de máscara para o CPF
    $(document).ready(function () {
        $('#CPF').inputmask("999.999.999-99");
    });
    

})
function submitManual() {
    var jsonObj = JSON.parse($("#ConteudoPopup").val());
    if (jsonObj == '0') {
        jsonObj = null;
    }
        var cliente = {
            Nome: $("#Nome").val(),
            Sobrenome: $("#Sobrenome").val(),
            Email: $("#Email").val(),
            CEP: $("#CEP").val(),
            CPF: $("#CPF").inputmask("unmaskedvalue"),
            Nacionalidade: $("#Nacionalidade").val(),
            Estado: $("#Estado").val(),
            Cidade: $("#Cidade").val(),
            Logradouro: $("#Logradouro").val(),
            Telefone: $("#Telefone").val(),
            Beneficiarios: jsonObj
        };
        $.ajax({
            url: urlPost,
            method: "POST",
            data: JSON.stringify(cliente),
            contentType: "application/json",
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r)

                $("#formCadastro")[0].reset();
                limparGridBeneficiarios();
            }
        });
    
}
function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}


    