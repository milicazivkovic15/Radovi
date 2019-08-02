<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Store.aspx.cs" Inherits="Pet_Store.Store" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="CSS.css" rel="stylesheet" />
    <title>Store</title>
</head>
<body>
    <form id="form1" runat="server">
    <div class="content">
          <ul>
                <li><a href="Default.aspx">HOME</a></li>
                <li><a href="Store.aspx">STORE</a></li>
                <li><a href="Owner.aspx">OWNER</a></li>
                <li><a href="Dog.aspx">PET</a></li>
            </ul>
        <div class="page">
        <h1>PET STORE</h1>
        <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" DataSourceID="LinqDataSource1" sty>
            <Columns>
                <asp:BoundField DataField="ime_ljubimca" HeaderText="Pet name" SortExpression="ime_ljubimca" />
                 <asp:BoundField DataField="tip" HeaderText="Pet type" SortExpression="tip" />
                <asp:BoundField DataField="godine" HeaderText="Pet age" SortExpression="godine" />
                <asp:BoundField DataField="opis" HeaderText="Description" SortExpression="opis" />
                <asp:BoundField DataField="ime_vlasnika" HeaderText="Owner first name" SortExpression="ime_vlasnika" />
                <asp:BoundField DataField="prezime_vlasnika" HeaderText="Owner last name" SortExpression="prezime_vlasnika" />
                 <asp:BoundField DataField="adresa" HeaderText="Owner address" SortExpression="adresa" />
                </Columns>
        </asp:GridView>
        <asp:LinqDataSource ID="LinqDataSource1" runat="server" ContextTypeName="Pet_Store.DataClasses1DataContext" EntityTypeName="" TableName="stores"></asp:LinqDataSource>
  
         <table class="tabela">
            <tr>
                <td><asp:Label Text="Owner name:" runat="server"></asp:Label></td>
                 <td><asp:DropDownList ID="usvajanjeVlasnik" Width="170px" Font-Size="20px" runat="server" DataSourceID="LinqDataSource2" DataTextField="fname" DataValueField="owner_id"></asp:DropDownList>
                <asp:LinqDataSource ID="LinqDataSource2" runat="server" ContextTypeName="Pet_Store.DataClasses1DataContext" EntityTypeName="" TableName="owners"></asp:LinqDataSource></td>
            </tr>
            <tr>
                <td><asp:Label Text="Pet name:" runat="server"></asp:Label></td>
                <td><asp:DropDownList ID="usvajanjeLjubimac" Width="170px" Font-Size="20px" runat="server" DataSourceID="LinqDataSource3" DataTextField="name" DataValueField="pet_id"></asp:DropDownList>
                <asp:LinqDataSource ID="LinqDataSource3" runat="server" ContextTypeName="Pet_Store.DataClasses1DataContext" EntityTypeName="" TableName="pets"></asp:LinqDataSource></td>
            </tr>
            <tr>
                
                <td colspan="2"><asp:Button ID="usvoji" runat="server" Text="Change owner" OnClick="usvoji_Click"/></td>
                
            </tr>
        </table>
      </div>
    </div>
    </form>
</body>
</html>
