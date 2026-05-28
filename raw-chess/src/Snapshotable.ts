interface Snapshotable<T> {
  takeSnapshot: () => T
  restoreFromSnapshot: (s: T) => void
}

export { type Snapshotable as default }