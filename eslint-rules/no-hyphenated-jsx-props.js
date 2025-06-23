module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hyphenated prop names in JSX components',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const isUserDefinedComponent = (node) => {
      // User-defined components start with uppercase
      return node.name && /^[A-Z]/.test(node.name.name)
    }

    const isHyphenatedProp = (propName) => {
      // Exclude standard HTML attributes and common patterns
      const allowedPatterns = [
        /^aria-/,
        /^data-/,
        /^stroke/,
        /^fill/,
        /^viewBox$/,
        /^xmlns/,
      ]
      
      return propName.includes('-') && 
             !allowedPatterns.some(pattern => pattern.test(propName))
    }

    return {
      JSXOpeningElement(node) {
        if (!isUserDefinedComponent(node)) return

        node.attributes.forEach(attr => {
          if (attr.type === 'JSXAttribute' && attr.name && attr.name.name) {
            const propName = attr.name.name
            if (isHyphenatedProp(propName)) {
              context.report({
                node: attr,
                message: `Hyphenated prop name '${propName}' is not allowed in user-defined components. Use camelCase instead.`,
              })
            }
          }
        })
      },
    }
  },
}