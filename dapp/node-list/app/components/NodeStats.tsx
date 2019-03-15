import React from 'react'
import styled from 'styled-components'

const Title = styled.h4`
  color: gray;
  text-transform: lowercase;
  font-variant: small-caps;
`

const Value = styled.h1`
  font-size: 24px;
  color: ${props => (props.color ? props.color : 'black')};
`

const Aside = styled.span`
  color: #aaa;
  font-weight: light;
`

const NodeStats = () => {
  return (
    <div className="w-100 d-flex flex-wrap justify-content-between bg-white border my-4 py-3 px-2 px-sm-5 text-center">
      <div style={{ minWidth: 130 }}>
        <Title>Past Due</Title>
        <Value color="red">
          3.012 <small>ETH</small>
        </Value>
        <Aside>5 nodes</Aside>
      </div>
      <div style={{ minWidth: 130 }}>
        <Title>Bills to Collect</Title>
        <Value>
          10.224 <small>ETH</small>
        </Value>
      </div>
      <div style={{ minWidth: 130 }}>
        <Title>YTD Revenue</Title>
        <Value>
          70.780 <small>ETH</small>
        </Value>
      </div>
      <div style={{ minWidth: 130 }}>
        <Title>Subscription Fee</Title>
        <Value>
          0.2 <small>ETH</small>
        </Value>
        <Aside>per month</Aside>
      </div>
    </div>
  )
}

export default NodeStats
