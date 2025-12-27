document.addEventListener('DOMContentLoaded', function() {

    // Botão "Back to Top"
    const myButton = document.getElementById('btn-back-to-top');

    if (myButton) {
        window.onscroll = function () {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                myButton.classList.remove('invisible');
            } else {
                myButton.classList.add('invisible');
            }
        };

        myButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Máscara de Telefone
    const inputTelefone = document.getElementById('inputTelefone');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function (e) {
            let v = e.target.value.replace(/\D/g, "");
            v = v.substring(0, 11);
            v = v.replace(/^(\d\d)(\d)/g, "($1) $2");
            v = v.replace(/(\d)(\d{4})$/, "$1-$2");
            e.target.value = v;
        });
    }

    // Máscara de Moeda
    const inputValor = document.getElementById('inputValor');
    if (inputValor) {
        inputValor.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value === '') {
                e.target.value = '';
                return;
            }
            e.target.value = (parseFloat(value) / 100).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        });
    }

    // Máscara de Número do Processo
    const inputProcesso = document.getElementById('inputNumeroProcesso');
    if (inputProcesso) {
        inputProcesso.addEventListener('input', function (e) {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 20) v = v.slice(0, 20);
            
            v = v.replace(/^(\d{7})(\d)/, "$1-$2");
            v = v.replace(/-(\d{2})(\d)/, "-$1.$2");
            v = v.replace(/\.(\d{4})(\d)/, ".$1.$2");
            v = v.replace(/\.(\d{1})(\d)/, ".$1.$2");
            
            e.target.value = v;
        });
    }

    // Envio do Form com validação
    const contactForm = document.getElementById('contactForm');
    let alertTimeout;
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const form = event.target;
            const alertBox = document.getElementById('form-alert');
            const btnSubmit = document.getElementById('btnSubmit');
            
            if (alertTimeout) clearTimeout(alertTimeout);
            
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const formData = new FormData(form);
            
            // Verifica se os elementos de UI existem antes de manipular
            if(btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = 'Enviando...';
            }
            if(alertBox) alertBox.classList.add('d-none');

            fetch('mail/mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(alertBox) {
                    alertBox.classList.remove('d-none');
                    if (data.success) {
                        alertBox.classList.remove('alert-danger');
                        alertBox.classList.add('alert-success');
                        alertBox.innerText = data.message;
                        form.reset();
                        form.classList.remove('was-validated');
                    } else {
                        alertBox.classList.remove('alert-success');
                        alertBox.classList.add('alert-danger');
                        alertBox.innerText = data.message || 'Erro ao enviar.';
                    }

                    alertTimeout = setTimeout(() => {
                        alertBox.classList.add('d-none');
                    }, 5000);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                if(alertBox) {
                    alertBox.classList.remove('d-none', 'alert-success');
                    alertBox.classList.add('alert-danger');
                    alertBox.innerText = 'Erro de conexão com o servidor.';

                    alertTimeout = setTimeout(() => {
                        alertBox.classList.add('d-none');
                    }, 5000);
                }
            })
            .finally(() => {
                if(btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = 'Enviar';
                }
            });
        });
    }
});