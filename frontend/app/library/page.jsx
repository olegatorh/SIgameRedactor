"use client"

import Header from "@/app/header/header";
import ProtectedRoute from "@/app/services/protectedProvider";
import Content from "@/app/library/content";

export default function Quiz() {


  return (
      <Header>
          <ProtectedRoute>
              <div style={{display: 'flex', gap: '20px'}}>
                  <div style={{width: '50%'}}>
                  </div>
                    <Content/>
                  </div>
          </ProtectedRoute>
      </Header>

);
}
