<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = htmlspecialchars($_POST["name"]);
    $email   = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($_POST["message"]);

    $to      = "alpmis99@gmail.com"; // Burayı kendi e-posta adresinle değiştir
    $subject = "PromilHesapla İletişim Formu Mesajı";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $mailBody = "Ad: $name\nE-posta: $email\n\nMesaj:\n$message";

    if (mail($to, $subject, $mailBody, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
} else {
    echo "invalid";
}
?>
