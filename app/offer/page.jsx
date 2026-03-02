export default function OfferPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Договор публичной оферты
        </h1>

        <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-gray-700">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Общие положения</h2>
            
            <p>
              <strong>1.1.</strong> Настоящий Договор является официальным предложением (офертой) физическим и юридическим лицам заключить договор купли-продажи товаров дистанционным способом через интернет-сайт{' '}
              <a href="https://lvlmart.kz" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                https://lvlmart.kz
              </a>.
            </p>
            
            <p>
              <strong>1.2.</strong> В соответствии со статьёй 395 Гражданского кодекса Республики Казахстан, акцепт (принятие) условий настоящей оферты приравнивается к заключению письменного договора.
            </p>
            
            <p>
              <strong>1.3.</strong> Совершая заказ на сайте, Покупатель подтверждает, что ознакомился с условиями настоящего Договора, полностью согласен с ними и принимает их без возражений.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Стороны договора</h2>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Продавец:</p>
                <ul className="list-none ml-4 space-y-1">
                  <li>Товарищество с ограниченной ответственностью «Buynel»</li>
                  <li>БИН: 210840022706</li>
                  <li>
                    Электронная почта:{' '}
                    <a href="mailto:buynel@support.kz" className="text-blue-600 hover:underline">buynel@support.kz</a>
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold mb-2">Покупатель:</p>
                <p>Физическое или юридическое лицо, оформившее заказ на сайте{' '}
                  <a href="https://lvlmart.kz" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    lvlmart.kz
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Предмет договора</h2>
            
            <p>
              <strong>3.1.</strong> Продавец обязуется передать в собственность Покупателю товар, представленный на сайте, а Покупатель обязуется принять и оплатить товар на условиях настоящей оферты.
            </p>
            
            <p>
              <strong>3.2.</strong> Все характеристики и цены на сайте указаны справочно и могут быть изменены Продавцом без предварительного уведомления.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Порядок оформления заказа</h2>
            
            <p>
              <strong>4.1.</strong> Заказ оформляется Покупателем самостоятельно на сайте.
            </p>
            
            <p>
              <strong>4.2.</strong> После оформления заказа Покупатель получает подтверждение на указанный адрес электронной почты или в мессенджере.
            </p>
            
            <p>
              <strong>4.3.</strong> Продавец имеет право уточнить детали заказа, а также отказать в его выполнении в случае отсутствия товара на складе.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Цена и порядок оплаты</h2>
            
            <p>
              <strong>5.1.</strong> Цены на товары указаны в тенге (KZT) и включают все налоги.
            </p>
            
            <p>
              <strong>5.2.</strong> Оплата производится безналичным способом через доступные на сайте платежные системы.
            </p>
            
            <p>
              <strong>5.3.</strong> Моментом оплаты считается поступление средств на счёт Продавца.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Доставка и передача товара</h2>
            
            <p>
              <strong>6.1.</strong> Доставка осуществляется по территории Республики Казахстан способами, указанными на сайте.
            </p>
            
            <p>
              <strong>6.2.</strong> Стоимость и сроки доставки определяются при оформлении заказа.
            </p>
            
            <p>
              <strong>6.3.</strong> Риск случайной гибели или повреждения товара переходит к Покупателю с момента передачи товара службе доставки.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Возврат и обмен товара</h2>
            
            <p>
              <strong>7.1.</strong> Возврат и обмен товара надлежащего качества производится в соответствии с Законом Республики Казахстан «О защите прав потребителей».
            </p>
            
            <p>
              <strong>7.2.</strong> Для оформления возврата необходимо направить заявку на электронную почту{' '}
              <a href="mailto:buynel@support.kz" className="text-blue-600 hover:underline">buynel@support.kz</a> с указанием причины и контактных данных.
            </p>
            
            <p>
              <strong>7.3.</strong> Возврат денежных средств осуществляется тем же способом, которым была произведена оплата.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Права и обязанности сторон</h2>
            
            <p>
              <strong>8.1.</strong> Продавец обязуется:
            </p>
            
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>обеспечить достоверность информации о товаре;</li>
              <li>передать Покупателю товар надлежащего качества;</li>
              <li>сохранять конфиденциальность персональных данных Покупателя.</li>
            </ul>
            
            <p>
              <strong>8.2.</strong> Покупатель обязуется:
            </p>
            
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>предоставить достоверные данные при оформлении заказа;</li>
              <li>оплатить товар в полном объёме;</li>
              <li>принять доставленный товар.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Ответственность сторон</h2>
            
            <p>
              <strong>9.1.</strong> Продавец не несёт ответственности за вред, причинённый Покупателю вследствие неправильного использования товара.
            </p>
            
            <p>
              <strong>9.2.</strong> Покупатель несёт ответственность за достоверность предоставленных данных.
            </p>
            
            <p>
              <strong>9.3.</strong> В случае возникновения споров стороны стремятся урегулировать их путём переговоров; при невозможности — спор подлежит рассмотрению в судах Республики Казахстан.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Конфиденциальность и защита данных</h2>
            
            <p>
              <strong>10.1.</strong> Продавец обязуется не разглашать персональные данные Покупателя третьим лицам, за исключением случаев, предусмотренных законодательством Республики Казахстан.
            </p>
            
            <p>
              <strong>10.2.</strong> Подробности обработки персональных данных изложены в{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Политике конфиденциальности</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Срок действия оферты</h2>
            
            <p>
              <strong>11.1.</strong> Настоящая оферта вступает в силу с момента её размещения на сайте и действует бессрочно.
            </p>
            
            <p>
              <strong>11.2.</strong> Продавец имеет право изменить условия оферты без предварительного уведомления.
            </p>
            
            <p>
              <strong>11.3.</strong> Все изменения вступают в силу с момента их публикации на сайте.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">📩 Реквизиты продавца:</h2>
            
            <div className="space-y-2 text-gray-700">
              <p><strong>Товарищество с ограниченной ответственностью «Buynel»</strong></p>
              <p><strong>БИН/ИИН:</strong> 210840022706</p>
              <p><strong>Номер счёта:</strong> KZ26 8562 2031 2166 2145</p>
              <p><strong>Валюта:</strong> KZT</p>
              <p><strong>Банк:</strong> АО «Банк ЦентрКредит»</p>
              <p><strong>БИК:</strong> KCJBKZKX</p>
              <p><strong>КБе:</strong> 17</p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:buynel@support.kz" className="text-blue-600 hover:underline">buynel@support.kz</a>
              </p>
              <p>
                <strong>Сайт:</strong>{' '}
                <a href="https://lvlmart.kz" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  https://lvlmart.kz
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
