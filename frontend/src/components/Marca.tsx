export function Marca() {
  return (
    <span className="marca">
      <picture>
        <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
        <img src="/space-jam-logo-v2-mobile.png" alt="" width="48" height="51" />
      </picture>
      <span>SPACE JAM</span>
    </span>
  )
}
