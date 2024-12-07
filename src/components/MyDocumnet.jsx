import {
  Page,
  Text,
  Document,
  StyleSheet,
  Image,
  Font,
  View,
} from '@react-pdf/renderer';
import natoArabicRegular from '../assets/fonts/Noto_Kufi_Arabic/static/NotoKufiArabic-Regular.ttf';
import arial from '../assets/fonts/ARIAL.ttf';
import cairo from '../assets/fonts/Cairo-Regular.ttf';
import ibm from '../assets/fonts/IBMPlexSansArabic-Regular.ttf';
import design from '../assets/design.png';
import { convertArabic } from 'arabic-reshaper';
// Register custom font
Font.register({
  family: 'Noto',
  fonts: [{ src: natoArabicRegular }],
});
Font.register({
  family: 'Arial',
  fonts: [{ src: arial }],
});
Font.register({
  family: 'Cairo',
  fonts: [{ src: cairo }],
});
Font.register({
  family: 'IBM',
  fonts: [{ src: ibm }],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  design: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 'auto',
    maxHeight: '100%',
  },
  logoContainer: {
    marginTop: 15,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '25%',
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
  },
  backLogoContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%', // Full height of the page
    width: '100%',
    paddingLeft: 10,
    paddingTop: 50,
  },
  backLogo: {
    width: 400,
    height: 400,
    opacity: 0.25,
  },
  drNameContainer: {
    position: 'absolute',
    width: '39%',
    marginLeft: '61%',
    height: '11%',
    marginTop: 45,
    display: 'flex',
    flexDirection: 'col',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  description: {
    position: 'absolute',
    width: '33%',
    height: '11%',
    marginLeft: 5,
    marginTop: 45,
    display: 'flex',
    flexDirection: 'col',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'center',
  },
  patientInfo: {
    position: 'absolute',
    top: 125,
    left: 350,
  },
  name: {
    position: 'absolute',
    top: 125,
    width: '82.5%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ageTitle: {
    position: 'absolute',
    top: 125,
    left: 210,
  },
  age: {
    position: 'absolute',
    top: 125,
    width: '49.5%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateTitle: {
    position: 'absolute',
    top: 125,
    left: 120,
  },
  date: {
    position: 'absolute',
    top: 125,
    width: '28%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  phoneTitle: {
    position: 'absolute',
    top: 550,
    left: 350,
  },
  phone: {
    position: 'absolute',
    top: 550,
    width: '83%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addressTitle: {
    position: 'absolute',
    top: 570,
    left: 350,
  },
  address: {
    position: 'absolute',
    top: 570,
    width: '83%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rxContainer: {
    position: 'absolute',
    top: 180,
    width: '90%',
    display: 'flex',
    marginLeft: '10%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    rowGap: '10px',
  },
});
const date = new Date();
export default function MyDocument({ patient, user, rx }) {
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <Image style={styles.design} src={design} />
        <View style={styles.logoContainer}>
          <Image src={user.logo} style={styles.logo}></Image>
        </View>
        <View style={styles.backLogoContainer}>
          <Image src={user.logo} style={styles.backLogo}></Image>
        </View>
        <View style={styles.drNameContainer}>
          <Text style={{ fontFamily: 'Noto', fontSize: 16 }}>
            {convertArabic(user.gender === 'male' ? 'الدكتور' : 'الدكتورة')}
          </Text>
          <Text style={{ fontFamily: 'Noto', fontSize: 16 }}>
            {convertArabic(user.name)}
          </Text>
        </View>
        <View style={styles.description}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {user.description}
          </Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {convertArabic(': اسم المريض')}
          </Text>
        </View>
        <View style={styles.name}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {convertArabic(patient.patientName)}
          </Text>
        </View>
        <View style={styles.ageTitle}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {convertArabic(': العمر')}
          </Text>
        </View>
        <View style={styles.age}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {convertArabic(patient.age)}
          </Text>
        </View>
        <View style={styles.dateTitle}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {convertArabic(': التارخ')}
          </Text>
        </View>
        <View style={styles.date}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {date.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.phoneTitle}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {convertArabic(': رقم الهاتف')}
          </Text>
        </View>
        <View style={styles.phone}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {user.phoneNumber}
          </Text>
        </View>
        <View style={styles.addressTitle}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {convertArabic(': العنوان')}
          </Text>
        </View>
        <View style={styles.address}>
          <Text style={{ fontFamily: 'IBM', fontSize: 10 }}>
            {convertArabic(user.address)}
          </Text>
        </View>
        <View style={styles.rxContainer}>
          {rx.map((value, index) => (
            <Text key={index} style={{ fontFamily: 'IBM', fontSize: 10 }}>
              {`-${value}`}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
