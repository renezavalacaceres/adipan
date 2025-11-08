import React from 'react';
import { Button, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { format } from 'date-fns';

const GenerarPDF = ({ pedido, total, userDetails, formaPago, tipoCompra, cuotas = 4, incrementoCredito = 2, fechaPedido }) => {

  const crearPDF = async () => {
    try {
      // Construir el HTML del ticket
      const html = `
        <html>
          <head>
            <style>
              body { font-family: monospace; padding: 10px; }
              h1 { text-align: center; }
              .linea { border-bottom: 1px solid #000; margin: 5px 0; }
              .total { font-weight: bold; text-align: right; }
              .credito { color: orange; }
            </style>
          </head>
          <body>
            <h1>ADIPAN</h1>
            <p style="text-align:center;">Boleta de Pedido</p>
            <p>Cliente: ${userDetails?.name}</p>
            <p>Documento: ${userDetails?.dni || userDetails?.ruc}</p>
            <p>Email: ${userDetails?.email}</p>
            <p>Fecha emisión: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
            <div class="linea"></div>

            ${pedido.map(item => {
              const precioUnitario = tipoCompra === 'credito' ? item.precio + incrementoCredito : item.precio;
              return `
                <p><b>${item.nombre}</b></p>
                <p>Cant: ${item.cantidad} | P.U: S/ ${precioUnitario} | Total: S/ ${precioUnitario * item.cantidad}</p>
              `;
            }).join('')}

            <div class="linea"></div>
            <p class="total">TOTAL: S/ ${total}</p>
            <p>Forma de pago: ${formaPago}</p>
            <p>Tipo de compra: ${tipoCompra === 'credito' ? `Crédito en ${cuotas} cuotas` : 'Contado'}</p>
            ${tipoCompra === 'credito' ? `<p class="credito">Cada producto +S/ ${incrementoCredito}, total dividido en ${cuotas} cuotas</p>` : ''}
            <p>Fecha de entrega: ${fechaPedido ? format(new Date(fechaPedido), 'dd/MM/yyyy HH:mm') : 'No disponible'}</p>
            <div class="linea"></div>
            <p style="text-align:center;">¡Gracias por su compra!</p>
            <p style="text-align:center;">ADIPAN - Calidad y tradición</p>
          </body>
        </html>
      `;

      // Crear PDF
      const options = {
        html,
        fileName: `Boleta_Pedido_${Date.now()}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('PDF generado', `Se guardó en: ${file.filePath}`);
    } catch (error) {
      console.log('Error generando PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

  return <Button title="Generar PDF del Pedido" onPress={crearPDF} />;
};

export default GenerarPDF;
