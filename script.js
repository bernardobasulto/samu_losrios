async function generarPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('ficha-legal');
    const btn = document.getElementById('btnPDF');
    const qtcValue = (document.getElementById('qtc')?.value || "SN").trim();

    btn.innerText = "⏳ GENERANDO REGISTRO...";
    btn.disabled = true;

    // Forzar ancho A4 y reducir variaciones de layout
    element.classList.add('print-mode');

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: 1024
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calcular el mejor ajuste para UNA sola página sin recortes
        const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
        const imgWidth = canvas.width * ratio;
        const imgHeight = canvas.height * ratio;
        const x = (pageWidth - imgWidth) / 2;  // centrar horizontal
        const y = (pageHeight - imgHeight) / 2; // centrar vertical

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`REGISTRO_SAMU_QTC_${qtcValue || 'SN'}.pdf`);

    } catch (e) {
        console.error(e);
        alert("Error al generar el documento. Intente nuevamente.");
    } finally {
        element.classList.remove('print-mode');
        btn.innerText = "📥 GENERAR PDF";
        btn.disabled = false;
    }
}