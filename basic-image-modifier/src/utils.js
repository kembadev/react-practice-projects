export class Result {
  constructor (value, success, error) {
    this.value = value
    this.success = success
    this.error = error
  }

  static Successful = (value) => new Result(value, true, null)

  static Failed = ({ value = undefined, error }) => new Result(typeof value, false, error)
}
