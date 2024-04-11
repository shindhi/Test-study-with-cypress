import assert from 'assert'

class RegisterForm {
  elements = {
    titleInput: () => cy.get('#title'),
    titleFeedback: () => cy.get('#titleFeedback'),
    imageUrlInput: () => cy.get('#imageUrl'),
    urlFeedback: () => cy.get('#urlFeedback'),
    submitBtn: () => cy.get('#btnSubmit'),
    cardList: () => cy.get('#card-list .card-img')
  }

  typeTitle(text) {
    if (!text) return
    this.elements.titleInput().type(text)
  }

  typeUrl(text) {
    if (!text) return
    this.elements.imageUrlInput().type(text)
  }

  clickSubmit() {
    this.elements.submitBtn().click()
  }

  hitEnter() {
    cy.focused().type('{enter}')
  }
}

const registerForm = new RegisterForm()
const colors = {
  errors: 'rgb(220, 53, 69)',
  success: 'rgb(134, 183, 254)'
}

describe('Image Registration', () => {
  after(() => {
    cy.clearAllLocalStorage()
  })
  
  describe('Submitting an image with invalid inputs', () => {
    after(() => {
      cy.clearLocalStorage()
    })

    const input = {
      title: '',
      url: ''
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })

    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })

    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit()
    })

    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      registerForm.elements.titleFeedback().should('contains.text', 'Please type a title for the image')
    })
    
    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements.urlFeedback().should('contains.text', 'Please type a valid URL')
    })

    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      // registerForm.elements.titleFeedback().should(element => {
      //   debugger
      // })

      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')

        assert.strictEqual(border, colors.errors)
      })

    })
  })

  describe('Submitting an image with valid inputs using enter key', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    const inputs = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }

    it(`Given I am on the image registration page`, () => {
      cy.visit('/')
    })

    it(`When I enter "${inputs.title}" in the title field`, () => {
      registerForm.typeTitle(inputs.title)
    })

    it(`Then I should see a check icon in the title field`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')

        assert.strictEqual(border, colors.success)
      })
    })

    it(`When I enter "${inputs.url}" in the URL field`, () => {
      registerForm.typeUrl(inputs.url)
    })

    it(`Then I should see a check icon in the imageUrl field`, () => {
      registerForm.elements.imageUrlInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')

        assert.strictEqual(border, colors.success)
      })
    })

    it(`Then I can hit enter to submit the form`, () => {
      registerForm.hitEnter()
      cy.wait(200)
    })

    it(`And the list of registered images should be updated with the new item`, () => {
      registerForm.elements.cardList().should((elements) => {
        const lastElement = elements[elements.length - 1]
        const src = lastElement.getAttribute('src')

        assert.strictEqual(src, inputs.url)
      })
    })
    
    it(`And the new item should be stored in the localStorage`, () => {
      cy.getAllLocalStorage().should((ls) => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]

        assert.deepStrictEqual(lastElement, {
          title: inputs.title,
          imageUrl: inputs.url
        })
      })
    })

    it(`Then The inputs should be cleared`, () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')
    })
  })

  describe('Submitting an image and updating the list', () => {
    const inputs = {
      title: 'BR Alien',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }

    after(() => {
      cy.clearLocalStorage()
    })

    it(`Given I am on the image registration page`, () => {
      cy.visit('/')
    })

    it(`Then I have entered "${inputs.title}" in the title field`, () => {
      registerForm.typeTitle(inputs.title)
    })

    it(`Then I have entered "${inputs.url}" in the URL field`, () => {
      registerForm.typeUrl(inputs.url)
    })

    it(`When I click the submit button`, () => {
      registerForm.clickSubmit()
    })

    it(`And the list of registered images should be updated with the new item`, () => {
      registerForm.elements.cardList().should((elements) => {
        const lastElement = elements[elements.length - 1]
        const src = lastElement.getAttribute('src')

        assert.strictEqual(src, inputs.url)
      })
    })

    it(`And the new item should be stored in the localStorage`, () => {
      cy.getAllLocalStorage().should((ls) => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]

        assert.deepStrictEqual(lastElement, {
          title: inputs.title,
          imageUrl: inputs.url
        })
      })
    })

    it(`Then The inputs should be cleared`, () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')
    })

  })
    
  describe('Refreshing the page after submitting an image clicking in the submit button', () => {
    const inputs = {
      title: 'Aliens',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }

    after(() => {
      cy.clearLocalStorage()
    })

    it(`Given I am on the image registration page`, () => {
      cy.visit('/')
    })
    
    it(`Then I have submitted an image by clicking the submit button`, () => {
      registerForm.typeTitle(inputs.title)
      registerForm.typeUrl(inputs.url)
      registerForm.clickSubmit()
      
      cy.wait(300)
    })
    
    it(`When I refresh the page`, () => {
      cy.reload()
    })
    
    it(`Then I should still see the submitted image in the list of registered images`, () => {
      cy.getAllLocalStorage().should((ls) => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]

        assert.deepStrictEqual(lastElement, {
          title: inputs.title,
          imageUrl: inputs.url
        })
      })
    })
    
  })
})