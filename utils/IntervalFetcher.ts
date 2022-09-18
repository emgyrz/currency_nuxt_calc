
export class IntervalFetcher<T> {
  timeoutID: null | number = null

  constructor(
    private url: string,
    private cb: (T) => unknown,
    private ms: number,
  ) {
    this.fetch()
  }

  private wait() {
    this.clearTimeout()
    // @ts-ignore
    this.timeoutID = setTimeout(() => {
      this.fetch()
    }, this.ms)
  }

  private fetch() {
    $fetch(this.url).then((res) => {
      this.cb(res)
      this.wait()
    })
  }

  private clearTimeout() {
    if (this.timeoutID !== null) {
      window.clearTimeout(this.timeoutID)
    }
    this.timeoutID = null
  }


  public destroy() {
    this.clearTimeout()
    this.cb = function () {}
  }

}
