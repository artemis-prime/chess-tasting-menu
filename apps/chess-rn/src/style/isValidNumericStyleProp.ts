export default (p: string): boolean => (
  [
    'opacity', 
    'bottom',
    'top',
    'left',
    'right',
    'start',
    'end',
    'height',
    'with',
    'gap',
  ].includes(p) ||
  p.endsWith('Radius') ||
  p.endsWith('Width') ||
  p.endsWith('Height') ||
  p.startsWith('inset') ||
  p.startsWith('margin') ||
  p.startsWith('padding') ||
  p.endsWith('Gap')
)