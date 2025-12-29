<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header('Content-Type: application/json; charset=utf-8');

$response = ['success' => false, 'message' => 'Erro desconhecido.'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método inválido.']);
    exit;
}

try {
    $nome = strip_tags(trim($_POST['nome'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $telefone = strip_tags(trim($_POST['telefone'] ?? ''));
    $estado = strip_tags(trim($_POST['estado'] ?? ''));
    $valor = strip_tags(trim($_POST['valor'] ?? ''));
    $processo = strip_tags(trim($_POST['processo'] ?? ''));

    if (empty($nome) || empty($email) || empty($telefone)) {
        throw new Exception('Preencha os campos obrigatórios.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('E-mail inválido.');
    }

    $mail = new PHPMailer(true);
    
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    
    // DADOS GMAIL
    $mail->Username   = getenv('SMTP_USER'); // TO DO add env var
    $mail->Password   = getenv('SMTP_PASS'); // TO DO add env var
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
    $mail->Port       = 465;

    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    // Envio
    $mail->setFrom(getenv('SMTP_USER'), 'Site AlfamaWeb');
    $mail->addAddress(getenv('DEST_1')); // destinatários
    $mail->addAddress(getenv('DEST_2')); // destinatários
    $mail->addReplyTo($email, $nome);

    // Conteúdo
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = "Lead Site: $nome";

    $mail->Body    = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <h2 style='color: #065C99;'>Novo contato pelo site</h2>
            <p><strong>Nome:</strong> $nome</p>
            <p><strong>E-mail:</strong> $email</p>
            <p><strong>Telefone:</strong> $telefone</p>
            <p><strong>Estado:</strong> $estado</p>
            <hr>
            <p><strong>Valor:</strong> R$ $valor</p>
            <p><strong>Processo:</strong> $processo</p>
        </div>
    ";
    
    $mail->AltBody = "Nome: $nome\nTelefone: $telefone\nEmail: $email\nValor: $valor\nProcesso: $processo";

    $mail->send();

    $response['success'] = true;
    $response['message'] = 'Recebemos seus dados! Entraremos em contato em breve.';

} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Não foi possível enviar o e-mail no momento.';
}

echo json_encode($response);