from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from io import BytesIO
import datetime


class ReportGenerator:
    @staticmethod
    def create_pdf(results):
        buffer = BytesIO()

        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72, leftMargin=72,
            topMargin=72,   bottomMargin=72,
        )

        elements = []
        styles   = getSampleStyleSheet()

        styles.add(ParagraphStyle(
            name='CustomTitle', parent=styles['Heading1'],
            fontSize=24, textColor=colors.HexColor('#0f172a'),
            spaceAfter=30, alignment=1,
        ))
        styles.add(ParagraphStyle(
            name='SectionHeader', parent=styles['Heading2'],
            fontSize=16, textColor=colors.HexColor('#2563eb'),
            spaceBefore=20, spaceAfter=10,
        ))

        elements.append(Spacer(1, 50))
        elements.append(Paragraph(
            "SENTINELSCAN",
            ParagraphStyle('Logo', parent=styles['CustomTitle'], fontSize=36,
                           textColor=colors.HexColor('#2563eb'), alignment=1)
        ))
        elements.append(Paragraph(
            "SECURITY AUDIT REPORT",
            ParagraphStyle('SubLogo', parent=styles['Normal'], fontSize=18,
                           textColor=colors.HexColor('#475569'), alignment=1, spaceAfter=40)
        ))

        target_data = [
            ["Target URL:",           results.get('url', 'N/A')],
            ["Scan Date:",            datetime.datetime.now().strftime("%B %d, %Y %H:%M")],
            ["Risk Score:",           f"{results.get('risk_score', 0)}/100"],
            ["Vulnerabilities Found:", str(len(results.get('vulnerabilities', results.get('results', []))))],
            ["Pages Scanned:",        str(results.get('pages_scanned', 'N/A'))],
            ["Scan ID:",              f"SCAN-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"],
        ]
        target_table = Table(target_data, colWidths=[130, 300])
        target_table.setStyle(TableStyle([
            ('FONTNAME',      (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE',      (0, 0), (-1, -1), 10),
            ('TEXTCOLOR',     (0, 0), (0, -1),  colors.HexColor('#2563eb')),
            ('TEXTCOLOR',     (1, 0), (1, -1),  colors.HexColor('#1e293b')),
            ('ALIGN',         (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN',        (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING',    (0, 0), (-1, -1), 8),
            ('BACKGROUND',    (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID',          (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('BOX',           (0, 0), (-1, -1), 2, colors.HexColor('#2563eb')),
        ]))
        elements.append(target_table)
        elements.append(Spacer(1, 40))

        elements.append(Paragraph(
            "CONFIDENTIAL",
            ParagraphStyle('Confidential', parent=styles['Normal'], fontSize=10,
                           textColor=colors.HexColor('#94a3b8'), alignment=1)
        ))
        elements.append(Paragraph(
            "This report contains confidential information about the security assessment.",
            ParagraphStyle('ConfidentialText', parent=styles['Normal'], fontSize=8,
                           textColor=colors.HexColor('#94a3b8'), alignment=1)
        ))
        elements.append(PageBreak())

        elements.append(Paragraph("EXECUTIVE SUMMARY", styles['SectionHeader']))
        elements.append(Spacer(1, 10))

        risk_score = results.get('risk_score', 0)
        if risk_score >= 70:
            risk_level, risk_color = "CRITICAL", colors.HexColor('#dc2626')
        elif risk_score >= 50:
            risk_level, risk_color = "HIGH",     colors.HexColor('#f97316')
        elif risk_score >= 30:
            risk_level, risk_color = "MEDIUM",   colors.HexColor('#eab308')
        else:
            risk_level, risk_color = "LOW",      colors.HexColor('#3b82f6')

        risk_table = Table(
            [["Overall Risk Score", f"{risk_score}/100"], ["Risk Level", risk_level]],
            colWidths=[150, 150]
        )
        risk_table.setStyle(TableStyle([
            ('FONTNAME',      (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE',      (0, 0), (-1, -1), 14),
            ('ALIGN',         (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN',        (0, 0), (-1, -1), 'MIDDLE'),
            ('TEXTCOLOR',     (0, 0), (0, -1),  colors.HexColor('#2563eb')),
            ('TEXTCOLOR',     (1, 0), (1, -1),  risk_color),
            ('BACKGROUND',    (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('BOX',           (0, 0), (-1, -1), 2, risk_color),
            ('GRID',          (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('TOPPADDING',    (0, 0), (-1, -1), 20),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 20),
        ]))
        elements.append(risk_table)
        elements.append(Spacer(1, 20))

        vulns = results.get('vulnerabilities', results.get('results', []))
        severity_counts = {'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0}
        for v in vulns:
            sev = v.get('severity', 'Low')
            if sev in severity_counts:
                severity_counts[sev] += 1

        severity_data = [['Severity', 'Count', 'Impact']]
        for sev, impact in [
            ('Critical', 'Immediate action required'),
            ('High',     'Address within 24-48 hours'),
            ('Medium',   'Schedule for next sprint'),
            ('Low',      'Monitor and plan remediation'),
        ]:
            severity_data.append([sev, str(severity_counts[sev]), impact])

        severity_table = Table(severity_data, colWidths=[80, 60, 260])
        severity_table.setStyle(TableStyle([
            ('FONTNAME',      (0, 0), (-1, 0),  'Helvetica-Bold'),
            ('FONTSIZE',      (0, 0), (-1, -1), 10),
            ('ALIGN',         (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN',        (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID',          (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('BACKGROUND',    (0, 0), (-1, 0),  colors.HexColor('#2563eb')),
            ('TEXTCOLOR',     (0, 0), (-1, 0),  colors.white),
            ('BACKGROUND',    (0, 1), (-1, 1),  colors.HexColor('#fee2e2')),
            ('BACKGROUND',    (0, 2), (-1, 2),  colors.HexColor('#ffedd5')),
            ('BACKGROUND',    (0, 3), (-1, 3),  colors.HexColor('#fef9c3')),
            ('BACKGROUND',    (0, 4), (-1, 4),  colors.HexColor('#dbeafe')),
            ('TOPPADDING',    (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(Paragraph("Vulnerability Distribution", styles['SectionHeader']))
        elements.append(severity_table)
        elements.append(PageBreak())

        elements.append(Paragraph("DETAILED SECURITY FINDINGS", styles['SectionHeader']))
        elements.append(Spacer(1, 10))

        for i, vuln in enumerate(vulns, 1):
            severity = vuln.get('severity', 'Medium')
            if severity == 'Critical':
                severity_color, bg_color = colors.HexColor('#dc2626'), colors.HexColor('#fee2e2')
            elif severity == 'High':
                severity_color, bg_color = colors.HexColor('#f97316'), colors.HexColor('#ffedd5')
            elif severity == 'Medium':
                severity_color, bg_color = colors.HexColor('#eab308'), colors.HexColor('#fef9c3')
            else:
                severity_color, bg_color = colors.HexColor('#3b82f6'), colors.HexColor('#dbeafe')

            vuln_header = Table(
                [[f"#{i} {vuln.get('type', 'Unknown Vulnerability')}", f"[{severity.upper()}]"]],
                colWidths=[350, 100]
            )
            vuln_header.setStyle(TableStyle([
                ('FONTNAME',      (0, 0), (0, 0),  'Helvetica-Bold'),
                ('FONTNAME',      (1, 0), (1, 0),  'Helvetica-Bold'),
                ('FONTSIZE',      (0, 0), (-1, -1), 12),
                ('TEXTCOLOR',     (0, 0), (0, 0),  colors.HexColor('#1e293b')),
                ('TEXTCOLOR',     (1, 0), (1, 0),  severity_color),
                ('ALIGN',         (1, 0), (1, 0),  'RIGHT'),
                ('BACKGROUND',    (0, 0), (-1, -1), bg_color),
                ('TOPPADDING',    (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                ('LEFTPADDING',   (0, 0), (-1, -1), 15),
                ('RIGHTPADDING',  (0, 0), (-1, -1), 15),
                ('BOX',           (0, 0), (-1, -1), 2, severity_color),
            ]))
            elements.append(vuln_header)
            elements.append(Spacer(1, 5))

            ai_analysis  = vuln.get('ai_analysis', {})
            details_data = [
                ["Location:",    vuln.get('url', 'N/A')],
                ["Description:", vuln.get('description', 'No description available')],
            ]
            if ai_analysis:
                details_data.append(["AI Impact:",    ai_analysis.get('impact', 'N/A')])
                details_data.append(["Explanation:",  ai_analysis.get('explanation', 'N/A')])
            details_data.append(["Remediation:", vuln.get('remediation', 'No remediation provided')])
            if ai_analysis:
                if 'cwe'   in ai_analysis: details_data.append(["CWE:",           ai_analysis['cwe']])
                if 'owasp' in ai_analysis: details_data.append(["OWASP Category:", ai_analysis['owasp']])

            details_table = Table(details_data, colWidths=[110, 340])
            details_table.setStyle(TableStyle([
                ('FONTNAME',      (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE',      (0, 0), (-1, -1), 9),
                ('TEXTCOLOR',     (0, 0), (0, -1),  colors.HexColor('#2563eb')),
                ('TEXTCOLOR',     (1, 0), (1, -1),  colors.HexColor('#475569')),
                ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING',    (0, 0), (-1, -1), 6),
                ('LEFTPADDING',   (0, 0), (-1, -1), 10),
                ('RIGHTPADDING',  (0, 0), (-1, -1), 10),
                ('BACKGROUND',    (0, 0), (-1, -1), colors.HexColor('#ffffff')),
                ('GRID',          (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ]))
            elements.append(details_table)
            elements.append(Spacer(1, 15))

            if i < len(vulns):
                line_table = Table([[" "]], colWidths=[450])
                line_table.setStyle(TableStyle([
                    ('LINEABOVE',     (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
                    ('TOPPADDING',    (0, 0), (-1, -1), 5),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                ]))
                elements.append(line_table)
                elements.append(Spacer(1, 10))

        elements.append(PageBreak())

        elements.append(Paragraph("REMEDIATION PRIORITIES", styles['SectionHeader']))
        elements.append(Spacer(1, 10))

        timeline_map = {
            'Critical': 'Immediate (24h)',
            'High':     'Urgent (48h)',
            'Medium':   'Short-term (1 week)',
            'Low':      'Medium-term (1 month)',
        }
        priority_data = [['Priority', 'Severity', 'Vulnerability', 'Timeline']]
        for idx, v in enumerate(vulns[:10], 1):
            sev = v.get('severity', 'Medium')
            priority_data.append([str(idx), sev, v.get('type', 'Unknown'), timeline_map.get(sev, 'Schedule')])

        priority_table = Table(priority_data, colWidths=[50, 70, 230, 100])
        priority_table.setStyle(TableStyle([
            ('FONTNAME',      (0, 0), (-1, 0),  'Helvetica-Bold'),
            ('FONTSIZE',      (0, 0), (-1, -1), 9),
            ('ALIGN',         (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN',        (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID',          (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('BACKGROUND',    (0, 0), (-1, 0),  colors.HexColor('#2563eb')),
            ('TEXTCOLOR',     (0, 0), (-1, 0),  colors.white),
            ('TOPPADDING',    (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING',   (0, 0), (-1, -1), 10),
            ('RIGHTPADDING',  (0, 0), (-1, -1), 10),
        ]))
        row_bg = {'Critical': '#fee2e2', 'High': '#ffedd5', 'Medium': '#fef9c3', 'Low': '#dbeafe'}
        for ri in range(1, len(priority_data)):
            bg = row_bg.get(priority_data[ri][1])
            if bg:
                priority_table.setStyle(TableStyle([('BACKGROUND', (0, ri), (-1, ri), colors.HexColor(bg))]))

        elements.append(priority_table)
        elements.append(Spacer(1, 50))

        footer_table = Table(
            [[f"Generated by SentinelScan  ·  {datetime.datetime.now().strftime('%Y-%m-%d %H:%M UTC')}"]],
            colWidths=[450]
        )
        footer_table.setStyle(TableStyle([
            ('FONTNAME',  (0, 0), (-1, -1), 'Helvetica-Oblique'),
            ('FONTSIZE',  (0, 0), (-1, -1), 8),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#94a3b8')),
            ('ALIGN',     (0, 0), (-1, -1), 'CENTER'),
            ('LINEABOVE', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('TOPPADDING',(0, 0), (-1, -1), 8),
        ]))
        elements.append(footer_table)

        doc.build(elements)
        buffer.seek(0)
        return buffer