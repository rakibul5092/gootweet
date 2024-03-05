<?php

class API
{

    function sendEmail($fName )
    {
        echo json_encode('success');
        $to = 'rakib5092@gmail.com';
        $subject = 'Message Subject';
        $from = 'furniin.app@gmail.com';


        // To send HTML mail, the Content-type header must be set
        $headers = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        
        // Create email headers
        $headers .= 'From: ' . $from . "\r\n" .
            'Reply-To: ' . $from . "\r\n" .
            'X-Mailer: PHP/' . phpversion();

        // Compose a simple HTML email message
        $message = "
                    <html>
                    <head>
                        <title>Furniin</title>
                        <style>
                            body {
                                margin: 10px auto;
                                width: 1024px;
                            }

                            table {
                              font-family: arial, sans-serif;
                              border-collapse: collapse;
                              width: 100%;
                            }

                            td, th {
                              border: 1px solid black;
                              text-align: left;
                              padding: 8px;
                            }

                            tr:nth-child(even) {
                              background-color: #dddddd;
                            }

                            .buyerInfo > h3 {
                                margin-bottom: 10px;
                            }

                            .buyerInfo p {
                                margin: 5px 0 0;
                            }
                        </style>
                    </head>
                    <body>
                        <h3>Subject : <span style="font-weight: normal">Furniin Order</span></h3>
                        <div class="buyerInfo">
                            <h3>Buyer Info</h3>
                            <div>
                                <p>Full Name : $fName</p>
                                <p>Phone Number : 091273123</p>
                                <p>Email : email@email.com</p>
                                <p>Address : 1234 street</p>
                                <p>City : NA</p>
                                <p>Postal Code : NA</p>
                                <p>House : NA</p>
                                <p>Flat : NA</p>
                            </div>
                        </div>
                        <h3>Total Price: <span style="font-weight: normal">$220</span></h3>
                        <table>
                            <tr>
                                <th>Product Name</th>
                                <th>Product ID</th>
                                <th>Material Name</th>
                                <th>Material Code</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Table</td>
                                <td>1</td>
                                <td>$100</td>
                                <td>Black</td>
                                <td>Wood</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Table</td>
                                <td>1</td>
                                <td>$120</td>
                                <td>Black</td>
                                <td>Wood</td>
                            </tr>
                        </table>
                    </body>
                    </html>";
        $result;
        // Sending email
        if (mail($to, $subject, $message, $headers)) {
            $result['message']= 'Your mail has been sent successfully.';
            $result['status'] =true;
        } else {
            $result['message']= 'Unable to send email. Please try again.';
            $result['status'] = false;
        }
        echo json_encode($result);

    }
}
echo "test";
$fullName = "Rakibul Islam";
$api = new API();
#$api->sendEmail($fullName);

?>

