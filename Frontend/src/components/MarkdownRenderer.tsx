import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let tableBuffer: string[] = [];
  let inTable = false;

  const formatInline = (text: string): React.ReactNode => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--text-main)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} style={{ color: 'var(--text-muted)' }}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const renderTable = (rows: string[], keyPrefix: number) => {
    const cleanRows = rows.filter(r => r.trim().startsWith('|'));
    if (cleanRows.length < 2) return null;

    const headerLine = cleanRows[0];
    const headers = headerLine.split('|').map(s => s.trim()).filter(Boolean);
    const dataRows = cleanRows.slice(1).filter(r => !r.includes(':---') && !r.includes('---'));

    return (
      <div key={`table-${keyPrefix}`} style={{ overflowX: 'auto', margin: '1.25rem 0', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)' }}>
          <thead>
            <tr style={{ background: 'rgba(139, 92, 246, 0.18)' }}>
              {headers.map((h, i) => (
                <th key={i} style={{ padding: '0.65rem 0.85rem', color: '#c084fc', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700 }}>
                  {formatInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((rowStr, rIdx) => {
              const cells = rowStr.split('|').map(s => s.trim()).filter(Boolean);
              return (
                <tr key={rIdx} style={{ borderBottom: rIdx === dataRows.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)', background: rIdx % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '0.65rem 0.85rem', fontSize: '0.84rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                      {formatInline(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|')) {
      inTable = true;
      tableBuffer.push(trimmed);
      return;
    } else if (inTable) {
      inTable = false;
      elements.push(renderTable(tableBuffer, index));
      tableBuffer = [];
    }

    if (!trimmed) {
      elements.push(<div key={`space-${index}`} style={{ height: '0.4rem' }} />);
      return;
    }

    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={`hr-${index}`} style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.25rem 0' }} />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={`h1-${index}`} style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: '1.25rem 0 0.6rem 0' }}>{formatInline(trimmed.slice(2))}</h1>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={`h2-${index}`} style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '1.2rem 0 0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.35rem' }}>{formatInline(trimmed.slice(3))}</h2>);
      return;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={`h3-${index}`} style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)', margin: '1rem 0 0.4rem 0' }}>{formatInline(trimmed.slice(4))}</h3>);
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={`list-${index}`} style={{ display: 'flex', gap: '0.5rem', margin: '0.25rem 0 0.25rem 0.5rem', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
          <span style={{ color: 'var(--accent-purple)', fontWeight: 800 }}>•</span>
          <div>{formatInline(trimmed.slice(2))}</div>
        </div>
      );
      return;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={`num-${index}`} style={{ display: 'flex', gap: '0.5rem', margin: '0.25rem 0 0.25rem 0.5rem', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
          <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{numMatch[1]}.</span>
          <div>{formatInline(numMatch[2])}</div>
        </div>
      );
      return;
    }

    elements.push(
      <p key={`p-${index}`} style={{ margin: '0.35rem 0', fontSize: '0.88rem', lineHeight: '1.65', color: 'var(--text-main)' }}>
        {formatInline(trimmed)}
      </p>
    );
  });

  if (inTable && tableBuffer.length > 0) {
    elements.push(renderTable(tableBuffer, lines.length));
  }

  return <div className="markdown-content">{elements}</div>;
};

export default MarkdownRenderer;
