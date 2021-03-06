module.exports = (plugin, command, context) => {
  /**
   * Generates an example for use with the dev screens.
   *
   * @param {string} fileName - The template ejs file to create.
   * @param {Object} props - The properties to use for template expansion.
   */
  // DEPRECATED as of 3/2/17 as part of Ignite CLI Beta (https://github.com/infinitered/ignite/issues/636)
  async function addComponentExample (fileName, props = {}) {
    const { ignite, print } = context
      print.warning('DEPRECATION WARNING: Heads up! `botics.addComponentExample` is deprecated. Please use `botics.addPluginComponentExample` instead!')
    ignite.addPluginComponentExample(fileName, props)
  }

  return addComponentExample
}
