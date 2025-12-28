document.addEventListener('DOMContentLoaded', function() {

    // Máscaras de input

    // Telefone
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

    // Valor do pre ório
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

    // Número do Processo - Padrao CNJ
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

    // Validação do Formulário

    const contactForm = document.getElementById('contactForm');
    const checkboxPolitica = document.getElementById('politica');
    const labelPolitica = document.querySelector('label[for="politica"]');

    // Remove o erro do checkbox
    if(checkboxPolitica) {
        checkboxPolitica.addEventListener('change', function() {
            if(this.checked) {
                labelPolitica.classList.remove('checkbox-erro');
            }
        });
    }

    let alertTimeout;

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const form = event.target;
            const alertBox = document.getElementById('form-alert');
            const btnSubmit = document.getElementById('btnSubmit');
            let isValid = true;

            // Validação Checkbox
            if (!checkboxPolitica.checked) {
                isValid = false;
                labelPolitica.classList.add('checkbox-erro');
                // Remove a classe de erro após 1.5s
                setTimeout(() => {
                    labelPolitica.classList.remove('checkbox-erro'); 
                }, 1500); 
            }

            // Validação Telefone
            const telValue = inputTelefone.value.replace(/\D/g, '');
            if (telValue.length < 10) {
                inputTelefone.setCustomValidity("Telefone incompleto");
                isValid = false;
            } else {
                inputTelefone.setCustomValidity("");
            }

            // Validação Padrão
            if (!form.checkValidity()) {
                isValid = false;
            }
            
            form.classList.add('was-validated');

            if (!isValid) return;

            // Envio

            if(btnSubmit) {
                btnSubmit.disabled = true;
                const originalBtnText = btnSubmit.innerHTML;
                btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            }
            if(alertBox) alertBox.classList.add('d-none');
            if(alertTimeout) clearTimeout(alertTimeout);

            const formData = new FormData(form);

            fetch('mail/mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(alertBox) {
                    alertBox.classList.remove('d-none');
                    if (data.success) {
                        alertBox.className = 'alert position-fixed top-0 end-0 m-3 z-3 shadow alert-success';
                        alertBox.innerText = data.message;
                        form.reset();
                        form.classList.remove('was-validated');
                        if(checkboxPolitica) checkboxPolitica.checked = false; // reset
                    } else {
                        alertBox.className = 'alert position-fixed top-0 end-0 m-3 z-3 shadow alert-danger';
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
                    alertBox.classList.remove('d-none');
                    alertBox.className = 'alert position-fixed top-0 end-0 m-3 z-3 shadow alert-danger';
                    alertBox.innerText = 'Erro de conexão com o servidor.';
                    
                    alertTimeout = setTimeout(() => {
                        alertBox.classList.add('d-none');
                    }, 5000);
                }
            })
            .finally(() => {
                if(btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = 'ENVIAR'; // reset
                }
            });
        });
    }

    // Botão Back to Top
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
});