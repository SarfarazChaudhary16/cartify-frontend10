export function QuickReplies({ items, onPick }: { items: string[]; onPick: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onPick(item)}
          className="rounded-full border border-porcelain-300 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-cobalt-500 hover:text-cobalt-600 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-200 dark:hover:text-cobalt-400"
        >
          {item}
        </button>
      ))}
    </div>
  )
}