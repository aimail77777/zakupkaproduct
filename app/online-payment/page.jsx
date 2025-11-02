export default function OnlinePaymentPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Платежи. Оплата банковской картой онлайн
        </h1>

        <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-gray-700">
          <p>
            Наш сайт подключен к интернет-эквайрингу, и Вы можете оплатить Услугу банковской картой Visa или Mastercard. После подтверждения выбранного Товара либо услуги откроется защищенное окно с платежной страницей процессингового центра <strong><a href="https://tiptoppay.kz/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">TipTop Pay</a></strong>, где Вам необходимо ввести данные Вашей банковской карты. Для дополнительной аутентификации держателя карты используется протокол <strong>3-D Secure</strong>. Если Ваш Банк-эмитент поддерживает данную технологию, Вы будете перенаправлены на его сервер для прохождения дополнительной идентификации. Информацию о правилах и методах дополнительной идентификации уточняйте в Банке, выдавшем Вам банковскую карту.
          </p>

          <p>
            Услуга онлайн-оплаты осуществляется в соответствии с правилами Международных платежных систем <strong>Visa</strong> и <strong>MasterCard</strong> на принципах соблюдения конфиденциальности и безопасности совершения платежа, для этого используются самые актуальные методы проверки, шифрования и передачи данных по закрытым каналам связи. Ввод данных банковской карты осуществляется в защищенном окне на платежной странице <strong><a href="https://tiptoppay.kz/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">TipTop Pay</a></strong>.
          </p>

          <p>
            В поля на платежной странице требуется ввести номер карты, имя владельца карты, срок действия карты, трёхзначный код безопасности (<strong>CVV2</strong> для VISA или <strong>CVC2</strong> для MasterCard). Все необходимые данные отображены на поверхности банковской карты.
          </p>

          <p>
            <strong>CVV2/ CVC2</strong> — это трёхзначный код безопасности, находящийся на оборотной стороне карты.
          </p>

          <p>
            Далее в том же окне откроется страница Вашего банка-эмитента для ввода <strong>3-D Secure</strong> кода. В случае, если у вас не настроен статичный 3-D Secure, он будет отправлен на ваш номер телефона посредством SMS. Если 3-D Secure код к Вам не пришел, то следует обратится в ваш банк-эмитент.
          </p>

          <p>
            <strong>3-D Secure</strong> — это самая современная технология обеспечения безопасности платежей по картам в сети интернет. Позволяет однозначно идентифицировать подлинность держателя карты, осуществляющего операцию, и максимально снизить риск мошеннических операций по карте.
          </p>

          <section className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Гарантии безопасности</h2>
            
            <p>
              Процессинговый центр <strong><a href="https://tiptoppay.kz/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">TipTop Pay</a></strong> защищает и обрабатывает данные Вашей банковской карты по стандарту безопасности <strong>PCI DSS 3.0</strong>. Передача информации в платежный шлюз происходит с применением технологии шифрования <strong>SSL</strong>. Дальнейшая передача информации происходит по закрытым банковским сетям, имеющим наивысший уровень надежности. <strong><a href="https://tiptoppay.kz/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">TipTop Pay</a></strong> не передает данные Вашей карты нам и иным третьим лицам. Для дополнительной аутентификации держателя карты используется протокол <strong>3-D Secure</strong>.
            </p>
            
            <p>
              В случае, если у Вас есть вопросы по совершенному платежу, Вы можете обратиться в службу поддержки клиентов платежного сервиса по электронной почте{' '}
              <a href="mailto:support-kz@tiptoppay.inc" className="text-blue-600 hover:underline">support-kz@tiptoppay.inc</a>.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Безопасность онлайн-платежей</h2>
            
            <p>
              Предоставляемая Вами персональная информация (имя, адрес, телефон, e-mail, номер кредитной карты) является конфиденциальной и не подлежит разглашению. Данные Вашей кредитной карты передаются только в зашифрованном виде и не сохраняются на нашем Web-сервере.
            </p>
            
            <p>
              Безопасность обработки Интернет-платежей гарантирует <strong><a href="https://tiptoppay.kz/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ТОО «TipTop Pay Kazakhstan»</a></strong>. Все операции с платежными картами происходят в соответствии с требованиями <strong>VISA International</strong>, <strong>MasterCard</strong> и других платежных систем. При передаче информации используются специализированные технологии безопасности карточных онлайн-платежей, обработка данных ведется на безопасном высокотехнологичном сервере процессинговой компании.
            </p>
            
            <p>
              Оплата платежными картами безопасна, потому что:
            </p>
            
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Система авторизации гарантирует покупателю, что платежные реквизиты его платежной карты (номер, срок действия, CVV2/CVC2) не попадут в руки мошенников, так как эти данные не хранятся на сервере авторизации и не могут быть похищены.</li>
              <li>Покупатель вводит свои платежные данные непосредственно в системе авторизации <strong><a href="https://tiptoppay.kz/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">TipTop Pay</a></strong>, а не на сайте интернет-магазина, следовательно, платежные реквизиты карточки покупателя не будут доступны третьим лицам.</li>
            </ul>
          </section>

          {/* Картинки в конце */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-6 items-center justify-center sm:justify-start">
            <div className="flex-shrink-0">
              <img 
                src="/mastercard.png" 
                alt="Mastercard" 
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
            <div className="flex-shrink-0">
              <img 
                src="/visa.png" 
                alt="Visa" 
                className="h-12 sm:h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

