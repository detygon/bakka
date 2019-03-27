import Bakka from '../src'

const ADD_TODO = 'ADD_TODO'
const GET_TODOS = 'GET_TODOS'
const SET_NAME = 'SET_NAME'

const store = new Bakka(
  {
    initialState: {
      todos: [{ name: 'Write tests', done: false }],
      name: ''
    },
    actions: {
      [SET_NAME]: ({ commit }: any, name: string) => {
        commit(SET_NAME, name)
      },
      [ADD_TODO]: ({ commit }: any, todo: any) => {
        commit(ADD_TODO, todo)
      },
      [GET_TODOS]: ({ state }: any) => {
        return state.todos
      }
    },
    mutations: {
      [ADD_TODO]: (state: any, todo: any) => {
        state.todos.push(todo)
      },
      [SET_NAME]: (state: any, name: string) => {
        state.name = name
      }
    }
  },
  { strict: true }
)

describe('Bakka Store', () => {
  describe('-> Actions', () => {
    it('should call the action and return the list of todos', () => {
      expect(store.dispatch(GET_TODOS)).toHaveLength(1)
    })

    it('should call the action and run the mutation', () => {
      store.dispatch(ADD_TODO, { name: 'Hello', done: true })
      expect(store.dispatch(GET_TODOS)).toHaveLength(2)
    })
  })

  describe('-> Events', () => {
    it('should emit an event on state change and notify listeners', () => {
      const subscriberMock = jest.fn()
      store.subscribe(subscriberMock)
      store.dispatch(SET_NAME, 'Hello')
      expect(subscriberMock).toHaveBeenCalled()
    })
  })
})
