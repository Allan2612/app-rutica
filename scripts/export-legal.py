"""Export the in-app legal texts (TS arrays) to Markdown drafts for the lawyer."""
import re

def sections(ts):
    out = []
    for m in re.finditer(r"title: '([^']+)',\s*paragraphs: \[(.*?)\],\s*\}", ts, re.S):
        paras = re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(2))
        out.append((m.group(1), paras))
    return out

def write(src, dst, title, version_name, header):
    ts = open(src, encoding='utf8').read()
    version = re.search(rf"{version_name} = '([^']+)'", ts).group(1)
    md = [f'# {title} — BORRADOR', '', header.format(version=version, src=src), '', f'**Versión:** {version}', '']
    for t, ps in sections(ts):
        md += [f'## {t}', '']
        for p in ps:
            md += [p.replace("\\'", "'"), '']
    open(dst, 'w', encoding='utf8').write('\n'.join(md).rstrip() + '\n')
    print(dst, len(sections(ts)), 'secciones')

HEADER = ('> ⚖️ **Borrador técnico para revisión legal.** Describe lo que la app hace según el código al {version}.\n'
          '> Fuente en la app: `{src}`. Este archivo se genera a partir de ese; editar allá y volver a exportar con `python scripts/export-legal.py`.\n'
          '> Los textos entre corchetes [ ] son decisiones o datos que faltan.')
write('src/features/legal/privacyPolicy.ts', 'docs/legal/politica-privacidad-BORRADOR.md',
      'Política de Privacidad de Rutica', 'PRIVACY_POLICY_VERSION', HEADER + '\n> Marco: Ley 8968 y su Reglamento.')
write('src/features/legal/terms.ts', 'docs/legal/terminos-BORRADOR.md',
      'Términos y Condiciones de Rutica', 'TERMS_VERSION',
      HEADER + '\n> Marco: Ley 7472 y su Reglamento (comercio electrónico). La sección 6 necesita además a un contador (IVA, factura electrónica).')
