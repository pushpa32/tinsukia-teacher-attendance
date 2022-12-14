import { Breadcrumb } from 'antd'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function MyBreadcumb() {
  const location = useLocation();
  const path = location.pathname;
  const myArray = path.split("/");
  return (
    <>
      <Breadcrumb
        style={{
          margin: '16px 0',
          background: 'antiquewhite',
          padding: '10px'
        }}
      >
        {
          myArray.map((el, key) =>
            <Breadcrumb.Item key={key}><span style={{ textTransform: 'capitalize', color: 'grey', fontWeight: '500' }}>{el}</span></Breadcrumb.Item>
          )
        }
      </Breadcrumb>
      <hr />
    </>
  )
}
