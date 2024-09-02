
import { expect, it } from 'vitest'
import { render } from '@testing-library/react'
import LandingPage from './LandingPage'

it('Snapshot LandingPage', () => {
  const result = render(<LandingPage />)
  expect(result).toMatchSnapshot()
})