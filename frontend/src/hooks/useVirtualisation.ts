import { useRef, useEffect, useState } from "react"

const useVirtualization = (
  totalRows: number,
  totalCols: number,
  rowHeight = 24,
  colWidth = 90
) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visibleRange, setRange] = useState({
    startRow: 0,
    endRow: Math.min(19, totalRows - 1),
    startCol: 0,
    endCol: Math.min(11, totalCols - 1),
  })

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return
      const { scrollTop, scrollLeft } = ref.current
      setRange({
        startRow: Math.floor(scrollTop / rowHeight),
        endRow: Math.min(Math.floor(scrollTop / rowHeight) + 19, totalRows - 1),
        startCol: Math.floor(scrollLeft / colWidth),
        endCol: Math.min(Math.floor(scrollLeft / colWidth) + 11, totalCols - 1),
      })
    }
    ref.current?.addEventListener("scroll", onScroll)
    return () => ref.current?.removeEventListener("scroll", onScroll)
  }, [totalRows, totalCols, rowHeight, colWidth])
  return { containerRef: ref, visibleRange }
}

export default useVirtualization
