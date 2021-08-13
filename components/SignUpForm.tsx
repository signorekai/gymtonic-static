/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { gql, useQuery } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import LoadingGif from 'assets/images/loading.gif';

import Bubble from 'components/Bubble';

import SuccessEng from 'assets/images/SignUpComplete-Eng.png';
import SuccessMy from 'assets/images/SignUpComplete-Malay.png';
import SuccessZh from 'assets/images/SignUpComplete-Mandarin.png';
import Head from 'next/head';

interface WithSignUpFormState {
  showForm: boolean;
}

interface SignUpFormProps {
  showForm: boolean;
  setShowSignUpForm(arg0: boolean): void;
}

interface Translation {
  title: string;
  chooseOne: string;
  subtitle: string;
  name: string;
  age: string;
  email: string;
  contact: string;
  myAddress: string;
  note: string;
  seniorName: string;
  seniorAge: string;
  seniorAddress: string;
  warning: string;
  selectGym: string;
  signUpForMyself: string;
  signUpForSomeoneElse: string;
  submit: string;
}

const defaults: Translation = {
  title: 'Sign up',
  chooseOne: 'Come, choose one',
  subtitle:
    "Congratulations! You're taking the first step towards a stronger, better you.",
  name: 'My Name',
  age: 'My Age',
  email: 'My Email Address',
  contact: 'My Contact No.',
  myAddress: 'My Home Address',
  note: 'Note to Us (E.g. Any health conditions?)',
  seniorName: `Senior's Name`,
  seniorAge: `Senior's Age`,
  seniorAddress: `Senior's Home Address`,
  warning:
    'Please note that transportation is not provided. Seniors will have to travel to the Gym Tonic location on their own.',
  selectGym: 'Select preferred gym',
  signUpForMyself: 'I am signing up for myself',
  signUpForSomeoneElse: 'I am signing up for someone else',
  submit: 'submit',
};

const text: {
  en: Translation;
  zh: Translation;
  ms: Translation;
  ta: Translation;
} = {
  en: defaults,
  zh: {
    title: '报名',
    chooseOne: '来… 选一个',
    subtitle: '恭喜您，为更健壮的自己跨出第一步',
    name: '我的名字',
    age: '我的年龄',
    email: '我的电邮',
    contact: '我的联络号码',
    myAddress: '我的地址',
    note: '须注意事项（例如：任何健康状况？）',
    seniorName: '长者名字',
    seniorAge: '长者年龄',
    seniorAddress: '长者地址',
    warning: '我们不提供接送，长者须自行到健得力中心。',
    selectGym: '您首选的健得力中心',
    signUpForMyself: '我为自己报名',
    signUpForSomeoneElse: '我为别人报名',
    submit: '发送',
  },
  ms: {
    title: 'Mendaftar',
    chooseOne: 'Pilih satu',
    subtitle:
      'Tahniah! Anda telah mengambil langkah pertama kepada anda yang lebih kuat, lebih baik.',
    name: 'Nama Saya',
    age: 'Umar Saya',
    email: 'Alamat Emel Saya',
    contact: 'Nombor Telefon Saya',
    myAddress: 'Alamat Saya',
    note: 'Catatan kepada Kami (E.g. Ada keadaan kesihatan?)',
    seniorName: 'Nama Senior',
    seniorAge: `Umur Senior`,
    seniorAddress: `Alamat Senior`,
    warning:
      'Harap maklum bahawa pengangkutan tidak disediakan. Warga emas mesti pergi ke lokasi Gym Tonic sendiri.',
    selectGym: 'Pilih gim',
    signUpForMyself: 'Saya mendaftar untuk saya sendiri',
    signUpForSomeoneElse: 'Saya mendaftar untuk orang lain',
    submit: 'Hantar',
  },
  ta: {
    title: 'பதிவு',
    chooseOne: 'வாருங்கள், ஒன்றைத் தேர்ந்தெடுங்கள்',
    subtitle:
      'வாழ்த்துக்கள்! நீங்கள் ஒரு வலிமையான, சிறந்த நபராக மாறுவதற்கான முதல் அடியை எடுத்து வைக்கிறீர்கள்.',
    name: 'என் பெயர்',
    age: '我的年龄',
    email: '我的电邮',
    contact: '我的联络号码',
    myAddress: '我的地址',
    note: '须注意事项（例如：任何健康状况？）',
    seniorName: '长者名字',
    seniorAge: '长者年龄',
    seniorAddress: '长者地址',
    warning: '我们不提供接送，长者须自行到健得力中心。',
    selectGym: '您首选的健得力中心',
    signUpForMyself: '我为自己报名',
    signUpForSomeoneElse: '我为别人报名',
    submit: '发送',
  },
};

const textVariants = {
  initial: { y: -40, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  exit: { y: -40, opacity: 0 },
};

interface FormData {
  name: string;
  age: number;
  email: string;
  contact: string;
  myAddress: string;
  seniorName: string;
  seniorAge: number;
  seniorAddress: string;
  selectedGym: string;
  note: string;
  type: 'myself' | 'someone else';
}

const query = gql`
  {
    openToPublic: status(id: "dGVybToz") {
      name
      locations(where: { orderby: { field: TITLE, order: ASC } }) {
        edges {
          node {
            id
            title
            locationFields {
              area
              openingSoon
            }
            featuredImage {
              node {
                id
                mediaDetails {
                  height
                  width
                }
                sourceUrl(size: MEDIUM)
              }
            }
          }
        }
      }
    }
  }
`;

interface LocationQuery {
  data:
    | {
        openToPublic: {
          name: string;
          locations: {
            edges:
              | {
                  node: {
                    id: string;
                    title: string;
                    locationFields: {
                      area: string;
                      openingSoon: null;
                    };
                    featuredImage?: {
                      node: {
                        // id: string;
                        sourceUrl: string;
                        mediaDetails: {
                          height: number;
                          width: number;
                        };
                      };
                    };
                  };
                }[]
              | undefined;
          };
        };
      }
    | undefined;
}

const SignUpForm: React.FunctionComponent<SignUpFormProps> = ({
  showForm,
  setShowSignUpForm,
}: SignUpFormProps) => {
  const [lang, setLang] = useState<'en' | 'zh' | 'ms' | 'ta'>('en');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onTouched',
  });
  const watchSelectedGym = watch('selectedGym');
  const watchType = watch('type');
  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    void fetch('/api/email', {
      method: 'post',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        setSuccess(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  });

  const { data }: LocationQuery = useQuery(query);
  const locations = data?.openToPublic.locations?.edges;

  useEffect(() => {
    if (showForm) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      document.querySelector('html')?.classList.add('overflow-hidden');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      document.querySelector('html')?.classList.remove('overflow-hidden');
    }
  }, [showForm]);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AnimatePresence exitBeforeEnter>
        {showForm && (
          <motion.div
            variants={{
              initial: { opacity: 0 },
              enter: {
                opacity: 1,
                transition: {
                  delayChildren: 0.2,
                  staggerChildren: 0.5,
                },
              },
              exit: { opacity: 0 },
            }}
            initial="initial"
            animate="enter"
            exit="exit"
            className={`fixed bg-black-opaque z-70 top-0 left-0 w-full min-h-screen h-screen overflow-scroll flex flex-col ${
              success ? 'justify-center' : 'justify-start'
            } items-center cursor-generic`}>
            <AnimatePresence exitBeforeEnter>
              {success ? (
                <>
                  <div className="w-80 h-80 rounded-full relative">
                    <motion.button
                      onClick={() => {
                        setShowSignUpForm(false);
                        setTimeout(() => {
                          setSuccess(false);
                        }, 300);
                      }}
                      className="mt-3 inline-block w-7 h-7 md:w-8 md:h-8 absolute top-0 right-4 z-40 lg:-top-4 lg:-right-4 hover:cursor-generic"
                      variants={{
                        initial: { opacity: 0, y: -100 },
                        exit: { opacity: 0, y: -100 },
                        enter: { opacity: 1, y: 0 },
                      }}
                      type="button">
                      <svg
                        className="w-full h-full text-red lg:text-white stroke-current hover:opacity-80 transition-opacity"
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 28 28">
                        <g transform="translate(1674 2629) rotate(-90)">
                          <g
                            transform="translate(2629 -1674) rotate(90)"
                            fill="none"
                            strokeWidth="1.5">
                            <circle cx="14" cy="14" r="14" stroke="none" />
                            <circle cx="14" cy="14" r="13.25" fill="none" />
                          </g>
                          <line
                            x2="14"
                            transform="translate(2619.949 -1664.854) rotate(135)"
                            fill="none"
                            strokeWidth="1.5"
                          />
                          <line
                            x2="14"
                            transform="translate(2619.949 -1654.954) rotate(-135)"
                            fill="none"
                            strokeWidth="1.5"
                          />
                        </g>
                      </svg>
                    </motion.button>
                    {lang === 'en' && (
                      <Image
                        src={SuccessEng}
                        layout="fill"
                        unoptimized
                        alt=""
                      />
                    )}
                    {lang === 'ms' && (
                      <Image src={SuccessMy} layout="fill" unoptimized alt="" />
                    )}
                    {lang === 'zh' && (
                      <Image src={SuccessZh} layout="fill" unoptimized alt="" />
                    )}
                  </div>
                  <footer className="text-sm text-center text-white justify-self-end pb-4 w-full max-w-xs pt-4 mx-auto">
                    <p>
                      WhatsApp or call us at{' '}
                      <a href="tel:96882388">9688 2388</a> or email{' '}
                      <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a>
                    </p>
                    <p>
                      An initiative by{' '}
                      <a
                        href="//lienfoundation.org/"
                        target="_blank"
                        rel="noreferrer">
                        Lien Foundation
                      </a>
                    </p>
                  </footer>
                </>
              ) : (
                <motion.div
                  className="bg-pink max-w-3xl w-full lg:mt-28 px-4 md:px-16 relative"
                  variants={{
                    initial: { y: '50%', opacity: 0 },
                    enter: { y: 0, opacity: 1 },
                    exit: { y: '50%', opacity: 0 },
                  }}>
                  <motion.button
                    onClick={() => {
                      setShowSignUpForm(false);
                    }}
                    className="mt-3 inline-block w-7 h-7 md:w-8 md:h-8 absolute top-0 right-4 z-40 lg:-top-10 lg:-right-10 hover:cursor-generic"
                    variants={{
                      initial: { opacity: 0, y: -100 },
                      exit: { opacity: 0, y: -100 },
                      enter: { opacity: 1, y: 0 },
                    }}
                    type="button">
                    <svg
                      className="w-full h-full text-red lg:text-white stroke-current hover:opacity-80 transition-opacity"
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28">
                      <g transform="translate(1674 2629) rotate(-90)">
                        <g
                          transform="translate(2629 -1674) rotate(90)"
                          fill="none"
                          strokeWidth="1.5">
                          <circle cx="14" cy="14" r="14" stroke="none" />
                          <circle cx="14" cy="14" r="13.25" fill="none" />
                        </g>
                        <line
                          x2="14"
                          transform="translate(2619.949 -1664.854) rotate(135)"
                          fill="none"
                          strokeWidth="1.5"
                        />
                        <line
                          x2="14"
                          transform="translate(2619.949 -1654.954) rotate(-135)"
                          fill="none"
                          strokeWidth="1.5"
                        />
                      </g>
                    </svg>
                  </motion.button>
                  <div className="flex flex-row justify-center pt-5 md:pt-7 pb-10">
                    <button
                      className={`mr-2 focus:outline-none ${
                        lang === 'en' ? 'border-b-2' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setLang('en');
                      }}>
                      Eng
                      <span className="hidden md:inline">lish</span>
                    </button>
                    <button
                      className={`mr-2 focus:outline-none font-normal font-chinese ${
                        lang === 'zh' ? 'border-b-2' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setLang('zh');
                      }}>
                      中文
                    </button>
                    <button
                      className={`mr-2 focus:outline-none ${
                        lang === 'ms' ? 'border-b-2' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setLang('ms');
                      }}>
                      Behasa Malayu
                    </button>
                    <button
                      className={`mr-6 md:pr-0 focus:outline-none ${
                        lang === 'ta' ? 'border-b-2' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setLang('ta');
                      }}>
                      <img src="/images/tamil.svg" alt="" />
                    </button>
                  </div>
                  <motion.h1
                    variants={textVariants}
                    className={`page-title text-red relative z-20 pt-2 pb-2 text-center form--${lang}`}>
                    {text[lang].title}
                  </motion.h1>
                  <motion.h2
                    variants={textVariants}
                    className={`form--${lang} text-xl md:text-2xl md:max-w-4/5 mx-auto leading-tighter text-black font-black text-center mb-6 md:mb-12`}>
                    {text[lang].subtitle}
                  </motion.h2>
                  <form
                    onSubmit={onSubmit}
                    className={`form--${lang}
                      ${
                        loading ? 'pointer-events-none opacity-50 relative' : ''
                      }
                      ${
                        watchType !== 'myself' && watchType !== 'someone else'
                          ? 'form--disabled'
                          : ''
                      }
                    `}>
                    <div className="field-group flex-wrap !items-start !border-b-0 !mb-6 md:justify-center">
                      {!watchType && (
                        <p className="uppercase text-red text-xs text-center w-full pb-2">
                          {text[lang].chooseOne}
                        </p>
                      )}
                      <label className="text-red hover:cursor-generic md:pr-2">
                        <input
                          className="hidden input-radio"
                          type="radio"
                          value="myself"
                          {...register('type', {
                            required: true,
                          })}
                        />
                        <span>{text[lang].signUpForMyself}</span>
                      </label>
                      <label className="text-red text-right hover:cursor-generic md:pl-2">
                        <input
                          className="hidden input-radio"
                          type="radio"
                          value="someone else"
                          {...register('type', {
                            required: true,
                          })}
                        />
                        <span>{text[lang].signUpForSomeoneElse}</span>
                      </label>
                    </div>
                    <div className="form__inner-wrap">
                      {watchType === 'someone else' ? (
                        <>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.name ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                className="text-field"
                                placeholder={text[lang].name}
                                disabled={watchType !== 'someone else'}
                                {...register('name', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                            <div
                              className={`input-wrapper md:w-1/3 ${
                                errors.contact ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                disabled={watchType !== 'someone else'}
                                placeholder={text[lang].contact}
                                pattern="[0-9]*"
                                className="text-field md:border-l-2 border-red"
                                {...register('contact', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.email ? 'has-error' : ''
                              }`}>
                              <input
                                type="email"
                                className="text-field"
                                disabled={watchType !== 'someone else'}
                                placeholder={text[lang].email}
                                {...register('email', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.seniorName ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                className="text-field"
                                disabled={watchType !== 'someone else'}
                                placeholder={text[lang].seniorName}
                                {...register('seniorName', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                            <div
                              className={`input-wrapper md:w-1/3  ${
                                errors.seniorAge ? 'has-error' : ''
                              }`}>
                              <input
                                type="number"
                                placeholder={text[lang].seniorAge}
                                disabled={watchType !== 'someone else'}
                                className="text-field md:border-l-2"
                                {...register('seniorAge', {
                                  min: 12,
                                  max: 99,
                                  valueAsNumber: true,
                                  shouldUnregister: true,
                                  required: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.seniorAddress ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                className="text-field"
                                disabled={watchType !== 'someone else'}
                                placeholder={text[lang].seniorAddress}
                                {...register('seniorAddress', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.name ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                className="text-field"
                                disabled={watchType !== 'myself'}
                                placeholder={text[lang].name}
                                {...register('name', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                            <div
                              className={`input-wrapper md:w-1/3  ${
                                errors.age ? 'has-error' : ''
                              }`}>
                              <input
                                type="number"
                                disabled={watchType !== 'myself'}
                                placeholder={text[lang].age}
                                className="text-field md:border-l-2"
                                min="12"
                                max="99"
                                pattern="[0-9]*"
                                {...register('age', {
                                  min: 12,
                                  max: 99,
                                  valueAsNumber: true,
                                  shouldUnregister: true,
                                  required: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.email ? 'has-error' : ''
                              }`}>
                              <input
                                type="email"
                                disabled={watchType !== 'myself'}
                                className="text-field"
                                placeholder={text[lang].email}
                                {...register('email', {
                                  pattern:
                                    // eslint-disable-next-line no-useless-escape
                                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                            <div
                              className={`input-wrapper md:w-1/3 ${
                                errors.contact ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                disabled={watchType !== 'myself'}
                                placeholder={text[lang].contact}
                                className="text-field md:border-l-2 border-red"
                                minLength={8}
                                {...register('contact', {
                                  pattern: /[0-9+]{8}/,
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.myAddress ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                disabled={watchType !== 'myself'}
                                className="text-field"
                                placeholder={text[lang].myAddress}
                                {...register('myAddress', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="field-group">
                        <input
                          type="text"
                          disabled={
                            watchType !== 'myself' &&
                            watchType !== 'someone else'
                          }
                          className="text-field"
                          placeholder={text[lang].note}
                          {...register('note')}
                        />
                      </div>
                      <h6 className="text-red text-xs py-4 text-center">
                        {text[lang].warning}
                      </h6>

                      <button
                        type="button"
                        className={`mt-6 mb-0 py-2 w-full flex flex-row justify-center items-center ${
                          errors.selectedGym ? 'has-error' : ''
                        }`}
                        onClick={() => {
                          setShowLocationSelector(!showLocationSelector);
                        }}>
                        <h5 className="text-base text-red font-black text-center">
                          {text[lang].selectGym}
                        </h5>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`text-red stroke-current ml-2 ${
                            showLocationSelector ? '' : 'rotate-180'
                          }`}
                          width="13.084"
                          height="7.98"
                          viewBox="0 0 13.084 7.98">
                          <path
                            fill="none"
                            strokeWidth="1.5px"
                            d="M4315.6,3241.3l6.374,5.975-6.355,6.018"
                            transform="translate(3253.839 -4315.087) rotate(90)"
                          />
                        </svg>
                      </button>
                      <p className="text-center mb-4">{watchSelectedGym}</p>
                      <AnimatePresence exitBeforeEnter>
                        {showLocationSelector && (
                          <motion.div
                            className="w-full mb-3 flex flex-row flex-wrap justify-center items-start flex-last-item-align-start mx-auto h-full"
                            variants={{
                              initial: { maxHeight: 1 },
                              exit: { maxHeight: 1 },
                              enter: { maxHeight: 40000 },
                            }}>
                            {locations?.map(({ node: location }) => (
                              <>
                                {location.locationFields.openingSoon !==
                                  true && (
                                  <label
                                    key={location.id}
                                    htmlFor={location.id}
                                    className="w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3">
                                    <input
                                      className="hidden"
                                      id={location.id}
                                      type="radio"
                                      key={location.id}
                                      value={location.title}
                                      {...register('selectedGym', {
                                        required: true,
                                      })}
                                    />
                                    <Bubble
                                      variants={{
                                        initial: { y: -20, opacity: 0 },
                                        exit: { y: 0, opacity: 1 },
                                        enter: { y: 0, opacity: 1 },
                                      }}
                                      handler={() => {
                                        setValue('selectedGym', location.title);
                                        setShowLocationSelector(false);
                                        // clickHandler(location);
                                      }}
                                      borderColor="pink"
                                      className="w-full md:pb-8 hover:cursor-generic"
                                      subTitleClassName="text-center text-xs"
                                      titleClassName="text-sm md:text-base text-center"
                                      comingSoon={
                                        location.locationFields.openingSoon
                                      }
                                      title={location.title}
                                      subtitle={location.locationFields.area}
                                      thumbnail={
                                        location.featuredImage
                                          ? location.featuredImage.node
                                              .sourceUrl
                                          : '/images/map-no-icon.png'
                                      }
                                    />
                                  </label>
                                )}
                              </>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {loading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="pointer-events-none mx-auto w-full text-center">
                          <Image
                            src={LoadingGif}
                            alt=""
                            width={126}
                            height={222}
                          />
                        </motion.div>
                      )}
                      {!loading && (
                        <button
                          type="submit"
                          className="block mx-auto overflow-hidden hover:cursor-submit">
                          <div className="rounded-full uppercase text-xs pt-3 bg-red text-white w-24 h-24 -mb-14 text-center">
                            {text[lang].submit}
                          </div>
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function withSignUpForm<T extends React.Component>(
  Component: React.ComponentType<T>,
): React.ComponentClass<T & WithSignUpFormProps> {
  return class extends React.Component<
    T & WithSignUpFormProps,
    WithSignUpFormState
  > {
    constructor(props: T & WithSignUpFormProps) {
      super(props);
      this.setShowSignUpForm = this.setShowSignUpForm.bind(this);
      this.state = {
        showForm: false,
      };
    }

    setShowSignUpForm(showForm: boolean) {
      this.setState({ showForm });
    }

    render() {
      const { showForm } = this.state;
      return (
        <>
          <SignUpForm
            showForm={showForm}
            setShowSignUpForm={this.setShowSignUpForm}
          />
          <Component
            {...this.props}
            setShowSignUpForm={this.setShowSignUpForm}
          />
        </>
      );
    }
  };
}
