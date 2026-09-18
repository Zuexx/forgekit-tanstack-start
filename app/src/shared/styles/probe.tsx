import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  probe: {
    color: 'rgb(20, 120, 20)',
    fontWeight: 700,
    padding: 12,
    borderRadius: 6,
    backgroundColor: 'rgb(220, 250, 220)',
  },
})

export function StyleXProbe() {
  return (
    <p {...stylex.props(styles.probe)} data-testid="stylex-probe">
      StyleX probe — atomic CSS present means the pipeline works.
    </p>
  )
}
