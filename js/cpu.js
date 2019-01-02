((name, context = window, func) => { context[name] = func() })
  ('CpuMeter', this, () => {
    const isEmptyObject = object => Object.keys(object).length === 0
    const getProcessorUsage = (usage, oldUsage) =>
      Math.floor((usage.kernel + usage.user - oldUsage.kernel - oldUsage.user) / (usage.total - oldUsage.total) * 100)
 
    class CpuMeter {
      constructor() {
        if (!chrome || !chrome.system) {
          throw new Error(`No access to chrome.system.cpu!
            Please allow permission (system.cpu) in your manifest.json`)
        }
        this.cpuInfo = {}
        this.previousCpuInfo = {}
      }
 
      getInfo(callback) {
        this._update().then(info => {
          callback({
            cpuUsage: this.getCpuUsage()
          })
        })
      }
 
      getCpuUsage() {
        return this.cpuInfo.processors
          .reduce((acc, processor, index) => [...acc, getProcessorUsage(
            processor.usage,
            this.previousCpuInfo.processors[index].usage)], [])
          .reduce((acc, cpuUsage) => acc + cpuUsage, 0) / this.cpuInfo.processors.length
      }
 
      _update() {
        return new Promise(resolve => chrome.system.cpu.getInfo(cpuInfo => {
          this.previousCpuInfo = this.cpuInfo
          if (isEmptyObject(this.previousCpuInfo)) {
            this.previousCpuInfo = cpuInfo
          }
 
          this.cpuInfo = cpuInfo
          resolve(cpuInfo)
        }))
      }
    }
 
    return CpuMeter
  }, this)