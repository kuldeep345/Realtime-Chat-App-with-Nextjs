import { extendBaseTheme , ThemeConfig} from '@chakra-ui/react'


const config:ThemeConfig= {
    initialColorMode:"dark",
    useSystemColorMode:false
}

export const theme = extendBaseTheme({config},{
  colors:{
    brand:{
        100:"#3d84f7"
    }
  },
  styles:{
    global:()=>({
        body:{
            bg:"whiteAlpha.200"
        }
    })
  }
})

