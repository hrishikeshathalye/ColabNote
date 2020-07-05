import React from "react";

export default function UserItem({data}) {
  return (
    <div style={{maxWidth:'15rem', color:'white'}}>
      {data.first_name} {data.last_name}<br />
      {data.email}
    </div>
  );
}
