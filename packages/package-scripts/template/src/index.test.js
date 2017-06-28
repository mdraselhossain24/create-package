import hello from './index'

it('creates a nice greeting', () => {
	const greeting = hello('Konstantin')
	expect(greeting).toMatchSnapshot()
})
